import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlatformService } from './platforms.service';
import { Platform, PlatformSchema } from './schema/platforms.schema';
import { PlatformController } from './platforms.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Platform.name, schema: PlatformSchema },
    ]),
    ProfilesModule,
  ],
  controllers: [PlatformController],
  providers: [PlatformService],
})
export class PlatformModule {}
