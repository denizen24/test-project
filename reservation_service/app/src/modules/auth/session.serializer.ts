import { Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"
import { User } from "src/modules/users/mongo.schemas/user.schema";
import { UsersService } from "src/modules/users/users.service";
import { ID } from "src/types/ID";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private usersService: UsersService,
  ) {
    super();
  }
  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user.id)
  }
  async deserializeUser(id: ID, done: (err: Error, payload: Partial<User>) => void): Promise<void> {
    const user = await this.usersService.findById(id);
    done(null, user);
  }
}
