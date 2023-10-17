import { Injectable } from '@nestjs/common';
import { ID } from "src/types/ID";
import { UsersService } from '../users/users.service';
import { GenerateHashService } from "./generate-hash.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: GenerateHashService,
  ) {}

  async validateUserById(id: ID): Promise<any> {
    const user = await this.usersService.findById(id);
    if (user) {
      return user;
    }
    return null;
  }

  async validateUserByCredentials(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && this.hashService.isValid(password, user.passwordHash)) {
      return user;
    }
    return null;
  }
}
