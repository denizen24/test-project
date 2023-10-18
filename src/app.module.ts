import { AuthMechanism } from 'mongodb';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesGuard } from '@common/guards';

import { SupportRequestModule } from '@base/support-request/support-request.module';
import { UserModule } from '@base/user/user.module';

import { AuthModule } from '@api/auth/auth.module';
import { HotelApiModule } from '@api/hotel/hotel-api.module';
import { ReservationApiModule } from '@api/reservation/reservation.module';
import { SupportRequestApiModule } from '@api/support-request/support-request.module';

import { ENV_FILE_PATH } from './main';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => ({
        authMechanism: AuthMechanism.MONGODB_DEFAULT,
        // eslint-disable-next-line prettier/prettier
        uri: `mongodb://${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}`,
        dbName: configService.get('MONGO_DB_NAME'),
        user: configService.get('MONGO_DB_USER'),
        pass: configService.get('MONGO_DB_PASSWORD'),
      }),
    }),
    UserModule,
    SupportRequestModule,
    HotelApiModule,
    ReservationApiModule,
    AuthModule,
    SupportRequestApiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
