import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '@base/user/schemas/user.schema';
import { UserModule } from '@base/user/user.module';
import { UserService } from '@base/user/user.service';

import { SupportRequest, SupportRequestSchema } from './schema';
import { Message, MessageSchema } from './schema/message.schema';
import {
  SupportRequestService,
  SupportRequestClientService,
  SupportRequestEmployeeService,
} from './service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
  ],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
    UserService,
  ],
  exports: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class SupportRequestModule {}
