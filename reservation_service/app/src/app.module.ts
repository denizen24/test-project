import { Module } from '@nestjs/common';
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from '@nestjs/mongoose';
import { AppGateway } from "./app.gateway";
import config from './config';
import { AuthModule } from "./modules/auth/auth.module";
import { DownloadModule } from "./modules/download/download.module";
import { HotelsModule } from "./modules/hotels/hotels.module";
import { ReservationsModule } from "./modules/reservations/reservations.module";
import { SupportRequestModule } from "./modules/support-request/support-request.module";
import { UsersModule } from "./modules/users/users.module";

const modules = [
  MongooseModule.forRoot(config.dbUrl),
  AuthModule,
  HotelsModule,
  ReservationsModule,
  SupportRequestModule,
  UsersModule,
  DownloadModule,
  EventEmitterModule.forRoot(),
];

@Module({
  imports: [
    ...modules,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
