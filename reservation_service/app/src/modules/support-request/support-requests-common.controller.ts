import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from "src/enums/user-role.enum";
import { User } from "src/modules/users/mongo.schemas/user.schema";
import { ID } from "src/types/ID";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { MarkMessagesAsReadDto } from "./dto/mark-messages-as-read.dto";
import { CreateSupportRequestDto } from "./dto/send-message.dto";
import { SupportRequestClientService } from "./support-request-client.service";
import { SupportRequestEmployeeService } from "./support-request-employee.service";
import { SupportRequestMessageFormatter } from "./support-request-message.formatter";
import { SupportRequestService } from "./support-request.service";

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api/common/support-requests')
export class SupportRequestsCommonController {
  constructor(
    private messageFormatter: SupportRequestMessageFormatter,
    private supportRequestService: SupportRequestService,
    private employeeService: SupportRequestEmployeeService,
    private clientService: SupportRequestClientService,
  ) {}

  @Roles(UserRoleEnum.manager, UserRoleEnum.client)
  @Get("/:id/messages")
  async messages(@Param('id') id: ID, @Request() req: any) {
    const supportRequest = await this.getSupportRequest(id, req.user);
    return supportRequest.messages.map(item => this.messageFormatter.format(item));
  }

  @Roles(UserRoleEnum.manager, UserRoleEnum.client)
  @Post("/:id/messages")
  async sendMessage(
    @Param('id') id: ID,
    @Request() req: any,
    @Body(DtoValidationPipe) dto: CreateSupportRequestDto
  ) {
    const request = await this.getSupportRequest(id, req.user);
    dto.supportRequest = id;
    dto.authorId = req.user.id;
    const message = await this.supportRequestService.sendMessage(request, dto)
    return this.messageFormatter.format(message);
  }

  @Roles(UserRoleEnum.manager, UserRoleEnum.client)
  @Post("/:id/messages/read")
  async setMessageRead(
    @Param('id') id: ID,
    @Request() req: any,
    @Body(DtoValidationPipe) dto: MarkMessagesAsReadDto
  ) {
    const request = await this.getSupportRequest(id, req.user);
    dto.supportRequest = id;
    dto.user = req.user.id;
    dto.createdBefore = new Date(dto.createdBefore);
    if ([UserRoleEnum.client as string].includes(req.user.role)) {
      await this.clientService.markMessagesAsRead(request, dto);
      return { success: true };
    }
    if ([UserRoleEnum.manager as string].includes(req.user.role)) {
      await this.employeeService.markMessagesAsRead(request, dto);
      return { success: true };
    }
    throw new BadRequestException('Unknown user role');
  }

  private async getSupportRequest(id: ID, user: User) {
    const supportRequest = await this.supportRequestService.findById(id);
    if (!supportRequest) {
      throw new NotFoundException(`SupportRequest #${id} not found`);
    }
    if (!this.supportRequestService.canAccessRequest(supportRequest, user)) {
      throw new ForbiddenException('You can not access to this support request');
    }
    return supportRequest;
  }
}
