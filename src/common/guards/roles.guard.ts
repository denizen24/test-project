import { Observable } from 'rxjs';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { USER_ROLE } from '@common/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const userRoles = this.reflector.get<UserRole[]>(
      'userRoles',
      context.getHandler(),
    );

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const route = req.originalUrl.split('/');
    const isApiRoute = route[1] === 'api';
    const isRoleBasedRoute = Object.values(USER_ROLE).includes(route[2]);

    if (userRoles && userRoles.length) {
      if (!req.isAuthenticated()) {
        throw new UnauthorizedException();
      }

      const user = req.user;
      const routeAllowed = user && userRoles.includes(user?.role);

      if (!routeAllowed) {
        throw new ForbiddenException(
          'You do not have permission to access this resource.',
        );
      }
    }

    if (isApiRoute && isRoleBasedRoute) {
      if (!req.isAuthenticated()) {
        throw new UnauthorizedException();
      }

      const user = req.user;
      const routeAllowed = user && user?.role === route[2];

      if (!routeAllowed) {
        throw new ForbiddenException(
          'You do not have permission to access this resource.',
        );
      }
    }

    return true;
  }
}
