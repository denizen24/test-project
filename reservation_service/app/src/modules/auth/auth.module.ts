import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ClientController } from "./client.controller";
import { GenerateHashService } from "./generate-hash.service";
import { SessionSerializer } from "./session.serializer";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [AuthService, GenerateHashService, LocalStrategy, SessionSerializer],
  exports: [AuthService, GenerateHashService],
  controllers: [AuthController, ClientController],
})
export class AuthModule {}
