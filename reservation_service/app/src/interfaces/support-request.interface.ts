import { ID } from "src/types/ID";
import { iMessage } from "./message.interface";

export interface iSupportRequest {
  userId: ID;
  createdAt: Date;
  messages: iMessage[];
  isActive: boolean;
}
