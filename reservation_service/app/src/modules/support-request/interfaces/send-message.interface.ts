import { ID } from "src/types/ID";

export interface SendMessage {
  authorId: ID;
  supportRequest: ID;
  text: string;
}
