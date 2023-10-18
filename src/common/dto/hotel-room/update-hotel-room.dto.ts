import { Expose } from 'class-transformer';

import { HotelRoomDTO } from './hotel-room.dto';

export class UpdateHotelRoomDTO extends HotelRoomDTO {
  @Expose()
  isEnabled: boolean;
}
