import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AccountService } from 'src/accounts/accounts.service';
import TypeAccount from 'src/accounts/types/type-account';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Account } from 'src/accounts/schema/account.schema';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { randomBytes } from 'crypto';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private profilesService: ProfilesService,
    private accountService: AccountService,
    private hashService: HashService,
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  private async getTokens(profileId): Promise<ITokens> {
    const basePayload = { sub: profileId };

    const accessTokenPayload = {
      ...basePayload,
      jti: randomBytes(16).toString('hex'), // добавляем случайный идентификатор JWT
      type: 'access',
    };

    const refreshTokenPayload = {
      ...basePayload,
      jti: randomBytes(16).toString('hex'), // добавляем случайный идентификатор JWT
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload);
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async auth(profile: ProfileDocument): Promise<Account> {
    const tokens = await this.getTokens(profile._id);
    const authProfile = await this.accountService.saveRefreshToken(
      profile._id,
      tokens,
    );
    return await this.accountService.findByIdAndProvider(
      authProfile._id,
      TypeAccount.LOCAL,
    );
  }

  async validatePassword(
    accountEmail: string,
    password: string,
  ): Promise<Profile> {
    const account = await this.accountService.findByEmailAndType(
      accountEmail,
      TypeAccount.LOCAL,
    );
    if (!account) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    } else {
      const isPasswordMatched = await this.hashService.isPasswordCorrect(
        password,
        account.credentials.password,
      );
      if (!isPasswordMatched) {
        throw new UnauthorizedException('Неверное имя пользователя или пароль');
      } else {
        return account.profile;
      }
    }
  }

  async refreshToken(oldRefreshToken: string): Promise<ITokens> {
    //--Проверяем, есть ли oldRefreshToken в базе данных и удаляем его--//
    const account = await this.accountService.findAndDeleteRefreshToken(
      oldRefreshToken,
    );

    if (!account) {
      throw new UnauthorizedException('Невалидный refreshToken');
    }

    //--Создаем новые accessToken и refreshToken--//
    const tokens = await this.getTokens(account.profile);

    //--Обновляем refreshToken в базе данных--//
    await this.accountService.saveRefreshToken(account.profile._id, tokens);

    return tokens;
  }

  async registration(
    authDto: AuthDto,
    provider: TypeAccount = TypeAccount.LOCAL,
  ): Promise<Account> {
    const { profileData, accountData } = authDto;
    const email = accountData.credentials.email;
    accountData.type = provider;
    let profile;

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const existsAccountByTypeAndEmail =
        await this.accountService.findByEmailAndType(email, provider, session);

      if (existsAccountByTypeAndEmail) {
        throw new ConflictException('Аккаунт уже существует');
      }

      const existsAccount = await this.accountService.findByEmail(
        email,
        session,
      );

      if (!existsAccount) {
        //--Создаем новый профиль--//
        profile = await this.profilesService.create(profileData, session);
      } else {
        profile = await this.profilesService.findByEmail(email, session);
      }

      //--Создаем новый аккаунт--//
      const newAccount = await this.accountService.create(
        accountData,
        profile._id,
        session,
      );

      const tokens = await this.getTokens(profile._id);

      accountData.credentials.accessToken = tokens.accessToken;
      accountData.credentials.refreshToken = tokens.refreshToken;

      await this.accountService.update(newAccount._id, accountData, session);

      profile.accounts.push(newAccount);
      await profile.save({ session });

      await session.commitTransaction();

      return await this.accountService.findByIdAndProvider(
        profile._id,
        provider,
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async sendPasswordResetEmail(email) {
    const profile = await this.profilesService.findByEmail(email);
    if (!profile) {
      throw new NotFoundException('Пользователь с указанным Email не найден');
    }
    return {
      message: `Ссылка на сброс пароля отправлена на ваш email: ${email}`,
    };
  }

  async authSocial(dataLogin: AuthDto, typeAccount: TypeAccount) {
    const user = await this.accountService.findByEmailAndType(
      dataLogin.accountData.credentials.email,
      typeAccount,
    );

    if (user) {
      const { refreshToken, accessToken } = await this.getTokens(
        user.profile._id,
      );

      await this.accountService.update(user._id, {
        credentials: {
          email: user.credentials.email,
          refreshToken,
          accessToken,
        },
      });

      return this.accountService.findByIdAndProvider(
        user.profile._id,
        typeAccount,
      );
    }

    return await this.registration(dataLogin, typeAccount);
  }

  async authYandex(codeAuth: string) {
    const CLIENT_ID = this.configService.get('YANDEX_APP_ID');
    const CLIENT_SECRET = this.configService.get('YANDEX_APP_SECRET');
    const TOKEN_URL = this.configService.get('YANDEX_TOKEN_URL');
    const USER_INFO_URL = this.configService.get('YANDEX_USER_INFO_URL');

    try {
      const tokenResponse = await axios.post(
        TOKEN_URL,
        `grant_type=authorization_code&code=${codeAuth}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${CLIENT_ID}:${CLIENT_SECRET}`,
            ).toString('base64')}`,
          },
        },
      );
      const accessToken = tokenResponse.data.access_token;

      const userDataResponse = await axios.get(
        `${USER_INFO_URL}&oauth_token=${accessToken}`,
      );
      return userDataResponse;
    } catch (error) {
      throw new HttpException(
        'Ошибка в процессе авторизации через Яндекс',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async authMailru(codeAuth: string) {
    const CLIENT_ID = this.configService.get('MAILRU_APP_ID');
    const CLIENT_SECRET = this.configService.get('MAILRU_APP_SECRET');
    const TOKEN_URL = this.configService.get('MAILRU_TOKEN_URL');
    const USER_INFO_URL = this.configService.get('MAILRU_USER_INFO_URL');
    // Кодирование CLIENT_ID и CLIENT_SECRET для Basic Authorization
    const authString = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const encodedAuthString = Buffer.from(authString).toString('base64');
    try {
      const tokenResponse = await axios.post(
        TOKEN_URL,
        `grant_type=authorization_code&code=${codeAuth}&redirect_uri=${this.configService.get(
          'MAILRU_REDIRECT_URL',
        )}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encodedAuthString}`,
          },
        },
      );
      const accessToken = tokenResponse.data.access_token;
      // Получение информации о пользователе с использованием токена доступа
      const userDataResponse = await axios.get(
        `${USER_INFO_URL}?access_token=${accessToken}`,
      );
      return userDataResponse.data;
    } catch (error) {
      throw new HttpException(
        'Ошибка в процессе авторизации через Mail.ru',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
