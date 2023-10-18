import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Hotel, HotelSchema } from './schema/hotel.schema';
import { HotelRoom, HotelRoomSchema } from './schema/hotelRoom.schema';
import { HotelService, HotelRoomService } from './service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  providers: [HotelService, HotelRoomService],
  exports: [HotelService, HotelRoomService],
})
export class HotelModule {}
