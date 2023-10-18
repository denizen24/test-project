import { Expose, Transform, Type } from 'class-transformer';

import { BaseDTO } from '../base.dto';
import { HotelDTO } from '../hotel';
import { BaseHotelRoomDTO } from '../hotel-room';

export class ReservationDTO extends BaseDTO {
  @Expose({ name: 'startDate' })
  @Transform(({ value }) => value.toISOString())
  dateStart: string;

  @Expose({ name: 'endDate' })
  @Transform(({ value }) => value.toISOString())
  dateEnd: string;

  @Expose({ name: 'hotelRoom' })
  @Type(() => BaseHotelRoomDTO)
  roomId: BaseHotelRoomDTO;

  @Expose({ name: 'hotel' })
  @Type(() => HotelDTO)
  hotelId: HotelDTO;
}
