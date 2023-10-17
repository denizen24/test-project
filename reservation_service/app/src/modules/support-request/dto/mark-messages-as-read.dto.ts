import { IsDateString, IsDefined } from "class-validator";
import { ID } from "src/types/ID";
import { MarkMessagesAsRead } from "../interfaces/mark-messages-as-read.interface";

export class MarkMessagesAsReadDto implements MarkMessagesAsRead {
  @IsDefined() @IsDateString()
  createdBefore: Date;

  supportRequest: ID;
  user: ID;
}
