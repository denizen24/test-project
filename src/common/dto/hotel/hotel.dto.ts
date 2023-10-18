import { Expose } from 'class-transformer';

import { BaseDTO } from '../base.dto';

export class HotelDTO extends BaseDTO {
  @Expose()
  title: string;

  @Expose()
  description: string;
}
