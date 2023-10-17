import { ID } from "src/types/ID";

export interface GetChatListParams {
  userId: ID | null;
  isActive: boolean;
  limit: number;
  offset: number;
}
