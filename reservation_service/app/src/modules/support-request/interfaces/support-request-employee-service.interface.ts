import { ID } from "src/types/ID";
import { Message } from "../mongo.schemas/message.schema";
import { SupportRequest } from "../mongo.schemas/support-request.schema";
import { MarkMessagesAsRead } from "./mark-messages-as-read.interface";

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(request: SupportRequest, params: MarkMessagesAsRead): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}
