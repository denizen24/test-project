import { Expose } from 'class-transformer';

import { BaseDTO } from '../base.dto';

export class BaseHotelRoomDTO extends BaseDTO {
  @Expose()
  description: string;

  @Expose()
  images: string[];
}
