import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { LocalAuthGuard } from "../auth/guards/local.auth.guard";
import { NotAuthenticatedGuard } from "../auth/guards/not-authenticated.guard";
import { UsersFormatter } from "../users/users.formatter";

@Controller('/api/auth')
export class AuthController {
  constructor(
    private usersFormatter: UsersFormatter,
  ) {}

  @UseGuards(NotAuthenticatedGuard, LocalAuthGuard)
  @Post("/login")
  async authLogin(
    @Request() req: any,
  ) {
    return this.usersFormatter.format(req.user);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/logout')
  logout(@Request() req: any): any {
    req.session.destroy();
  }
}
