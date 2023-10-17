import { ID } from "src/types/ID";

export interface iMessage {
  authorId: ID;
  sentAt: Date;
  text: string;
  readAt: Date;
}
