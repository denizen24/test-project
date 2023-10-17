import { ID } from "src/types/ID";

export interface MarkMessagesAsRead {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}
