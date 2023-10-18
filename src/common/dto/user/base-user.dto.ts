import { Expose } from 'class-transformer';

import { BaseDTO } from '../base.dto';

export class BaseUserDTO extends BaseDTO {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  contactPhone: string;

  constructor(partial: Partial<BaseUserDTO>) {
    super(partial);
  }
}
