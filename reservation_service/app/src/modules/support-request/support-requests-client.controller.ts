import { Body, Controller, Get, Post, Query, Request, UseGuards, } from '@nestjs/common';
import { defaultIfEmpty, from, map, mergeAll, scan } from "rxjs";
import { UserRoleEnum } from "src/enums/user-role.enum";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateSupportRequestDto } from "./dto/create-support-request.dto";
import { GetChatListParams } from "./interfaces/get-chat-list-params.interface";
import { SupportRequestClientService } from "./support-request-client.service";
import { SupportRequestFormatter } from "./support-request.formatter";
import { SupportRequestService } from "./support-request.service";

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api/client/support-requests')
export class SupportRequestsClientController {
  constructor(
    private supportRequestClientService: SupportRequestClientService,
    private supportRequestFormatter: SupportRequestFormatter,
    private supportRequestService: SupportRequestService,
  ) {}

  @Roles(UserRoleEnum.client)
  @Post("/")
  async addSupportRequest(@Body(DtoValidationPipe) dto: CreateSupportRequestDto, @Request() req: any) {
    dto.userId = req.user.id;
    const item = await this.supportRequestClientService.createSupportRequest(dto);
    return this.supportRequestFormatter.formatForClient(item, (await this.supportRequestClientService.getUnreadCount(item.id)).length);
  }

  @Roles(UserRoleEnum.client)
  @Get("/")
  async supportRequestsList(@Request() req: any, @Query() query: GetChatListParams) {
    query.userId = req.user.id;
    return from(this.supportRequestService.findSupportRequests(query))
      .pipe(mergeAll())
      .pipe(map(async (item) => {
        const unreadCount = (await this.supportRequestClientService.getUnreadCount(item.id)).length;
        return this.supportRequestFormatter.formatForClient(item, unreadCount);
      }))
      .pipe(mergeAll())
      .pipe(scan((acc, value) => [...acc, value], []))
      .pipe(defaultIfEmpty([]));
  }
}
