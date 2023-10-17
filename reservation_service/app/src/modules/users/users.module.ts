import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { User, UserSchema } from "./mongo.schemas/user.schema";
import { UsersAdminController } from "./users-admin.controller";
import { UsersManagerController } from "./users-manager.controller";
import { UsersFormatter } from "./users.formatter";
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, UsersFormatter],
  exports: [UsersService, UsersFormatter],
  controllers: [UsersAdminController, UsersManagerController],
})
export class UsersModule {}
