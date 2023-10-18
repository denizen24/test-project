import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { User } from '@base/user/schemas/user.schema';
import { UserService } from '@base/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User | null> {
    const userEmail = email.trim();
    const user = await this.userService.findByEmail(userEmail);
    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!user || !passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user && passwordValid) {
      return user;
    }

    return null;
  }
}
