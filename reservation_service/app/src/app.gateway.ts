import { UseFilters, UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from "src/modules/users/mongo.schemas/user.schema";
import { UserRoleEnum } from "./enums/user-role.enum";
import { WsExceptionFilter } from "./filters/ws.exception.filter";
import { Roles } from "./modules/auth/decorators/roles.decorator";
import { WsAuthenticatedGuard } from "./modules/auth/guards/ws.authenticated.guard";
import { WsRolesGuard } from "./modules/auth/guards/ws.roles.guard";
import { SupportRequestMessageFormatter } from "./modules/support-request/support-request-message.formatter";
import { SupportRequestService } from "./modules/support-request/support-request.service";
import { ID } from "./types/ID";

@UseFilters(new WsExceptionFilter)
@WebSocketGateway({ cors: true, credentials: true, })
export class AppGateway {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportMessageFormatter: SupportRequestMessageFormatter,
  ) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(WsAuthenticatedGuard, WsRolesGuard)
  @Roles(UserRoleEnum.manager, UserRoleEnum.client)
  @SubscribeMessage('subscribeToChat')
  async subscribeToChat(
    @MessageBody("payload") payload: { chatId: ID },
    @ConnectedSocket() client: Socket,
  ) {
    if (!payload?.chatId) {
      throw new WsException('payload.chatId is empty');
    }
    const user: User = (client.request as any)?.user;
    return this.supportRequestService.subscribe((supportRequest, message) => {
      if (this.supportRequestService.canAccessRequest(supportRequest, user)) {
        client.emit('newMessage', this.supportMessageFormatter.format(message));
      }
    });
  }
}
