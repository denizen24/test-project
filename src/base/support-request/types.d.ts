interface CreateSupportRequestDto {
  user: ID;
  text: string;
}

interface SendMessageParams {
  author: string;
  supportRequest: string;
  text: string;
}

interface MarkMessagesAsReadParams {
  user?: string;
  supportRequest: string;
  createdBefore: Date;
}

interface GetChatListParams extends Paginated {
  user?: ID | null;
  isActive?: bool;
}

interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageParams): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): void;
}

interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadParams);
  getUnreadCount(supportRequest: ID): Promise<number>;
}

interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadParams);
  getUnreadCount(supportRequest: ID): Promise<number>;
  closeRequest(supportRequest: ID): Promise<void>;
}
