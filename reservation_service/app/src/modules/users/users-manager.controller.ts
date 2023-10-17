import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from "src/enums/user-role.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UsersFormatter } from "../users/users.formatter";
import { UsersService } from "../users/users.service";
import { SearchUserParams } from "./interfaces/search-user-params.interface";

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api/manager/users')
export class UsersManagerController {
  constructor(
    private usersService: UsersService,
    private usersFormatter: UsersFormatter,
  ) {}

  @Roles(UserRoleEnum.manager)
  @Get("/")
  async usersList(@Query() query: SearchUserParams) {
    const users = await this.usersService.findAll(query);
    return users.map(user => this.usersFormatter.formatForAdmin(user));
  }
}
