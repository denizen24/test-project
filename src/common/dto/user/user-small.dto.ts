import { Expose } from 'class-transformer';

import { BaseDTO } from '../base.dto';

export class UserSmallDTO extends BaseDTO {
  @Expose()
  name: string;
}
