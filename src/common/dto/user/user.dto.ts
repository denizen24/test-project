import { Expose } from 'class-transformer';

import { BaseUserDTO } from './base-user.dto';

export class UserDTO extends BaseUserDTO {
  @Expose()
  role: UserRole;
}
