import { Expose, Transform, Type } from 'class-transformer';

import { BaseDTO } from '../base.dto';
import { UserSmallDTO } from '../user';

export class SupportRequestMessageDTO extends BaseDTO {
  @Expose({ name: 'createdAt' })
  sentAt: Date;

  @Expose()
  text: string;

  @Expose()
  @Transform(({ value }) => value ?? null)
  readAt: Date;

  @Expose()
  @Type(() => UserSmallDTO)
  author: UserSmallDTO;

  constructor(partial: Partial<SupportRequestMessageDTO>) {
    super(partial);
  }
}
