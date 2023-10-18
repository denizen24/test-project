import { Server } from 'socket.io';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { UserRoles } from '@common/decorators';
import { USER_ROLE } from '@common/enums';

import { MessageDocument } from '@base/support-request/schema/message.schema';
import { SupportRequestDocument } from '@base/support-request/schema/support-request.schema';
import { SupportRequestService } from '@base/support-request/service';

@WebSocketGateway({ namespace: 'support-request' })
export class SupportRequestGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @SubscribeMessage('subscribeToChat')
  @UserRoles([USER_ROLE.CLIENT, USER_ROLE.MANAGER])
  async subscribeToChat(@MessageBody() chatId: string) {
    const handler = (
      supportRequest: SupportRequestDocument,
      message: MessageDocument,
    ) => {
      const supportRequestId = supportRequest._id.toString();
      this.server
        .to(`support-request-${supportRequestId}`)
        .emit('new message', message);
    };

    this.supportRequestService.subscribe(handler);

    this.server.emit(
      'subscription result',
      `You have subscribed to messages from chat ${chatId}`,
    );
  }
}
