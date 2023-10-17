import { ID } from "src/types/ID";
import { Message } from "../mongo.schemas/message.schema";
import { SupportRequest } from "../mongo.schemas/support-request.schema";
import { CreateSupportRequest } from "./create-support-request.interface";
import { MarkMessagesAsRead } from "./mark-messages-as-read.interface";

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequest): Promise<SupportRequest>;
  markMessagesAsRead(request: SupportRequest, params: MarkMessagesAsRead): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
}
