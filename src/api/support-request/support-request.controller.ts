import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser, UserRoles } from '@common/decorators';
import {
  SupportRequestDTO,
  SupportRequestManagerDTO,
  SupportRequestMessageDTO,
} from '@common/dto';
import { USER_ROLE } from '@common/enums';
import { MongooseClassSerializerInterceptor } from '@common/interceptors';

import {
  SupportRequestClientService,
  SupportRequestEmployeeService,
  SupportRequestService,
} from '@base/support-request/service';

@Controller()
@SerializeOptions({ strategy: 'excludeAll' })
export class SupportRequestApiController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @Post('client/support-requests')
  @UseInterceptors(MongooseClassSerializerInterceptor(SupportRequestDTO))
  async createSupportRequest(
    @Body() body: CreateSupportRequestParams,
    @CurrentUser() user,
  ) {
    return await this.supportRequestClientService.createSupportRequest({
      ...body,
      user: user._id,
    });
  }

  @Get('client/support-requests')
  @UseInterceptors(MongooseClassSerializerInterceptor(SupportRequestDTO))
  async getClientSupportRequests(
    @CurrentUser() user,
    @Query() params: GetSupportRequestsQueryParams,
  ) {
    const requests = await this.supportRequestService.findSupportRequests({
      ...params,
      user: user._id,
    });

    return requests;
  }

  @Get('manager/support-requests')
  @UseInterceptors(MongooseClassSerializerInterceptor(SupportRequestManagerDTO))
  async getSupportRequests(@Query() params: GetSupportRequestsQueryParams) {
    return await this.supportRequestService.findSupportRequests({
      ...params,
    });
  }

  @Get('common/support-requests/:id/messages')
  @UserRoles([USER_ROLE.CLIENT, USER_ROLE.MANAGER])
  @UseInterceptors(MongooseClassSerializerInterceptor(SupportRequestMessageDTO))
  async getSupportRequestsMessages(@Param('id') id: string) {
    return await this.supportRequestService.getMessages(id);
  }

  @Post('common/support-requests/:id/messages')
  @UserRoles([USER_ROLE.CLIENT, USER_ROLE.MANAGER])
  @UseInterceptors(MongooseClassSerializerInterceptor(SupportRequestMessageDTO))
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser() user,
    @Body() body: CreateSupportRequestMessageParams,
  ) {
    return await this.supportRequestService.sendMessage({
      supportRequest: id,
      ...body,
      author: user._id,
    });
  }

  @Post('common/support-requests/:id/messages/read')
  @UserRoles([USER_ROLE.CLIENT, USER_ROLE.MANAGER])
  @UseInterceptors(MongooseClassSerializerInterceptor(SupportRequestMessageDTO))
  async markRead(
    @Param('id') supportRequest: string,
    @CurrentUser() user,
    @Body() body: MarkAsReadParams,
  ) {
    const params = {
      supportRequest,
      createdBefore: new Date(body.createdBefore),
    };

    if (user.role == USER_ROLE.MANAGER) {
      return await this.supportRequestEmployeeService.markMessagesAsRead(
        params,
      );
    } else if (user.role == USER_ROLE.CLIENT) {
      const supportRequestDocument =
        await this.supportRequestService.findSupportRequestById(supportRequest);
      const userMatch =
        supportRequestDocument.get('user').toString() != user._id.toString();

      if (userMatch) {
        throw new ForbiddenException('You are not allowed to do this action');
      }

      return await this.supportRequestClientService.markMessagesAsRead({
        ...params,
        user: user._id,
      });
    }
  }
}
