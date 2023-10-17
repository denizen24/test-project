import { Injectable } from "@nestjs/common";
import { UsersFormatter } from "../users/users.formatter";
import { Message } from "./mongo.schemas/message.schema";

@Injectable()
export class SupportRequestMessageFormatter {

    constructor(
      private usersFormatter: UsersFormatter,
    ) {}

    public format(item: Message) {
        const { id, sentAt, text, readAt } = item;
        return {
            id,
            createdAt: sentAt,
            text,
            readAt,
            author: item.author ? this.usersFormatter.format(item.author) : null,
        };
    }
}
