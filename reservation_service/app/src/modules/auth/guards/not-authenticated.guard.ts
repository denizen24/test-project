import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common"

@Injectable()
export class NotAuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.isAuthenticated()) {
      throw new BadRequestException('Route is available only for unauthorized users');
    }
    return true;
  }
}
