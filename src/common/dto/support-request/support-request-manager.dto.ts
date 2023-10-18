import { Expose, Type } from 'class-transformer';

import { SupportRequestDTO } from './support-request.dto';
import { BaseUserDTO } from '../user';

export class SupportRequestManagerDTO extends SupportRequestDTO {
  @Expose({ name: 'client' })
  @Type(() => BaseUserDTO)
  user: BaseUserDTO;

  constructor(partial: Partial<SupportRequestManagerDTO>) {
    super(partial);
  }
}
