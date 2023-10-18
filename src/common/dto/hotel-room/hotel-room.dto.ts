import { Expose, Type } from 'class-transformer';

import { BaseHotelRoomDTO } from './base-hotel-room.dto';
import { HotelDTO } from '../hotel/hotel.dto';

export class HotelRoomDTO extends BaseHotelRoomDTO {
  @Expose()
  @Type(() => HotelDTO)
  hotel?: HotelDTO;
}
