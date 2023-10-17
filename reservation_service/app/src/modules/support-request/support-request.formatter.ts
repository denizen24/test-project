import { Injectable } from "@nestjs/common";
import { UsersFormatter } from "../users/users.formatter";
import { SupportRequest } from "./mongo.schemas/support-request.schema";

@Injectable()
export class SupportRequestFormatter {

    constructor(
      private usersFormatter: UsersFormatter,
    ) {}

    public formatForClient(item: SupportRequest, unreadCount: number) {
        const { id, createdAt, isActive } = item;
        return { id, createdAt, isActive, hasNewMessages: unreadCount > 0 };
    }

    public formatForManager(item: SupportRequest, unreadCount: number) {
        return Object.assign(this.formatForClient(item, unreadCount), {
            client: this.usersFormatter.format(item.user as any), // TODO: check
        });
    }
}
