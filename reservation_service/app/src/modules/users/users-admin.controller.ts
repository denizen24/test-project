import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserRoleEnum } from "src/enums/user-role.enum";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateUserDto } from "../users/dto/user-create.dto";
import { UsersFormatter } from "../users/users.formatter";
import { UsersService } from "../users/users.service";
import { SearchUserParams } from "./interfaces/search-user-params.interface";

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api/admin/users')
export class UsersAdminController {
  constructor(
    private usersService: UsersService,
    private usersFormatter: UsersFormatter,
  ) {}

  @Roles(UserRoleEnum.admin)
  @Post("/")
  async users(@Body(DtoValidationPipe) createUserDto: CreateUserDto) {
    return this.usersFormatter.formatForAdmin(await this.usersService.create(createUserDto));
  }

  @Roles(UserRoleEnum.admin)
  @Get("/")
  async usersList(@Query() query: SearchUserParams) {
    const users = await this.usersService.findAll(query);
    return users.map(user => this.usersFormatter.formatForAdmin(user));
  }
}
