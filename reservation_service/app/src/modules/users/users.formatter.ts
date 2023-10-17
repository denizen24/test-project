import { Injectable } from "@nestjs/common";
import { User } from "./mongo.schemas/user.schema";

@Injectable()
export class UsersFormatter {

    public format(user: User) {
        const { id, email, name, contactPhone } = user;
        return { id, email, name, contactPhone }
    }

    public formatForAdmin(user: User) {
        const { id, email, name, contactPhone, role } = user;
        return { id, email, name, contactPhone, role }
    }
}
