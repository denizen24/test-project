import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const UserRoles = (roles: UserRole[]): CustomDecorator =>
  SetMetadata('userRoles', roles);
