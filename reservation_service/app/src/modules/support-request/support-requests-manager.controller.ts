import { Controller, Get, Query, Request, UseGuards, } from '@nestjs/common';
import { defaultIfEmpty, from, map, mergeAll, scan } from "rxjs";
import { UserRoleEnum } from "src/enums/user-role.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { GetChatListParams } from "./interfaces/get-chat-list-params.interface";
import { SupportRequestEmployeeService } from "./support-request-employee.service";
import { SupportRequestFormatter } from "./support-request.formatter";
import { SupportRequestService } from "./support-request.service";

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api/manager/support-requests')
export class SupportRequestsManagerController {
  constructor(
    private supportRequestEmployeeService: SupportRequestEmployeeService,
    private supportRequestFormatter: SupportRequestFormatter,
    private supportRequestService: SupportRequestService,
  ) {}

  @Roles(UserRoleEnum.manager)
  @Get("/")
  async supportRequestsList(@Request() req: any, @Query() query: GetChatListParams) {
    return from(this.supportRequestService.findSupportRequests(query))
      .pipe(mergeAll())
      .pipe(map(async (item) => {
          const unreadCount = (await this.supportRequestEmployeeService.getUnreadCount(item.id)).length;
          return this.supportRequestFormatter.formatForManager(item, unreadCount);
      }))
      .pipe(mergeAll())
      .pipe(scan((acc, value) => [...acc, value], []))
      .pipe(defaultIfEmpty([]));
  }
}
