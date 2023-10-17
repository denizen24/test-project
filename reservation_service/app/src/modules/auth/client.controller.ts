import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { NotAuthenticatedGuard } from "../auth/guards/not-authenticated.guard";
import { UsersFormatter } from "../users/users.formatter";
import { UsersService } from "../users/users.service";
import { ClientRegisterDto } from "./dto/client-register.dto";

@Controller('/api/client')
export class ClientController {
  constructor(
    private usersService: UsersService,
    private usersFormatter: UsersFormatter,
  ) {}

  @UseGuards(NotAuthenticatedGuard)
  @Post("/register")
  async clientRegister(@Body(DtoValidationPipe) clientRegisterDto: ClientRegisterDto) {
    clientRegisterDto.role = 'client';
    return this.usersFormatter.format(await this.usersService.create(clientRegisterDto));
  }
}
