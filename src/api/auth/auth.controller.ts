import * as bcrypt from 'bcrypt';

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
  Query,
  SerializeOptions,
} from '@nestjs/common';

import { Public } from '@common/decorators';
import { UserDTO, BaseUserDTO } from '@common/dto';
import { USER_ROLE } from '@common/enums';
import { MongooseClassSerializerInterceptor } from '@common/interceptors';

import { UserService } from '@base/user/user.service';

import { LoginGuard } from './guards/login.auth.guard';

@Controller()
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly userService: UserService) {}

  private async _createUser(body: CreateUserParams, role: UserRole) {
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltOrRounds);

    return await this.userService.create({
      email: body.email,
      name: body.name,
      passwordHash,
      role,
      contactPhone: body.contactPhone,
    });
  }

  @Post('auth/login')
  @UseGuards(LoginGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(BaseUserDTO))
  async login(@Request() req) {
    return req.user;
  }

  @Post('auth/logout')
  async logout(@Request() req, @Res() res): Promise<void> {
    req.session.destroy();
    res.status(204).send();
  }

  @Get(['admin/users', 'manager/users'])
  @UseInterceptors(MongooseClassSerializerInterceptor(BaseUserDTO))
  async getUsersForAdmin(@Query() searchParams: SearchUserParams) {
    return await this.userService.search(searchParams);
  }

  @Post('admin/users')
  @UseInterceptors(MongooseClassSerializerInterceptor(UserDTO))
  async createUser(@Body() { role, ...data }: AdminCreateUserParams) {
    return await this._createUser(data, role);
  }

  @Public()
  @Post('client/register')
  @UseInterceptors(MongooseClassSerializerInterceptor(BaseUserDTO))
  async createClientUser(@Body() body: CreateUserParams) {
    return await this._createUser(body, USER_ROLE.CLIENT);
  }
}
