import { Expose, Transform } from 'class-transformer';

import { BaseDTO } from '../base.dto';

export class SupportRequestDTO extends BaseDTO {
  @Expose()
  createdAt: Date;

  @Expose()
  isActive: boolean;

  @Expose({ name: 'hasNewMessages' })
  @Transform(({ value }) => value.some((message) => !message.readAt))
  messages;

  constructor(partial: Partial<SupportRequestDTO>) {
    super(partial);
  }
}
