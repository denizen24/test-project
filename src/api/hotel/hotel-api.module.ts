import { join } from 'path';

import { diskStorage } from 'multer';

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';

import { PUBLIC_DIR } from '@common/constants';
import { editFileName } from '@common/utils/file';

import { HotelModule } from '@base/hotel/hotel.module';

import { HotelApiController } from './hotel-api.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(PUBLIC_DIR, 'upload'),
        filename: editFileName,
      }),
    }),
    HotelModule,
  ],
  controllers: [HotelApiController],
})
export class HotelApiModule {}
