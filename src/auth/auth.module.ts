import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from 'src/profiles/schema/profile.schema';
import { Account, AccountSchema } from 'src/accounts/schema/account.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { AccountModule } from 'src/accounts/accounts.module';
import { HashModule } from 'src/hash/hash.module';
import { jwtOptions } from 'src/configs/jwt.config';
import { STRTAGIES } from './strategies';
import { GUARDS } from './guards';
import { HttpModule } from '@nestjs/axios';
import { AuthDtoPipe } from './pipe/auth-dto.pipe';
import { BlacklistTokensModule } from 'src/blacklistTokens/blacklistTokens.module';

@Module({
  imports: [
    HttpModule,
    ProfilesModule,
    AccountModule,
    HashModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync(jwtOptions()),
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
    BlacklistTokensModule,
  ],
  providers: [AuthService, ...STRTAGIES, ...GUARDS, AuthDtoPipe],
  exports: [AuthService, AuthDtoPipe],
  controllers: [AuthController],
})
export class AuthModule {}
