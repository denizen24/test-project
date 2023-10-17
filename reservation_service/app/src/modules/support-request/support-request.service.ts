import { Injectable } from "@nestjs/common";
import { isUndefined } from "@nestjs/common/utils/shared.utils";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserRoleEnum } from "src/enums/user-role.enum";
import { User } from "src/modules/users/mongo.schemas/user.schema";
import { ID } from "src/types/ID";
import { GetChatListParams } from "./interfaces/get-chat-list-params.interface";
import { SendMessage } from "./interfaces/send-message.interface";
import { ISupportRequestService } from "./interfaces/support-request-service.interface";
import { Message } from "./mongo.schemas/message.schema";
import { SupportRequest, SupportRequestDocument } from "./mongo.schemas/support-request.schema";
import { SupportRequestMessageService } from "./support-request-message.service";

@Injectable()
export class SupportRequestService implements ISupportRequestService {

    constructor(
      @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>,
      private messageService: SupportRequestMessageService,
      private eventEmitter: EventEmitter2,
    ) {}

    public async findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]> {
        const queryParams: Partial<SupportRequest> = {};
        const { limit, offset } = params;
        params.userId && (queryParams.userId = params.userId);
        !isUndefined(params.isActive) && (queryParams.isActive = params.isActive);
        const query = this.SupportRequestModel.find(queryParams);
        limit && query.limit(limit);
        offset && query.skip(offset);
        return await query.populate(this.populateParams()).select('-__v').exec();
    }

    public async sendMessage(request: SupportRequestDocument, data: SendMessage): Promise<Message> {
        const message = await this.messageService.addMessage(data);
        request.messageIds.push(message.id);
        await request.save();
        this.eventEmitter.emit("newMessage", { request, message });
        return message;
    }

    public async getMessages(supportRequest: ID): Promise<Message[]> {
        return (await this.findById(supportRequest)).messages || [];
    }

    public subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): void {
        this.eventEmitter.on('newMessage', params => handler(params.request, params.message));
    }

    public async findById(id: ID): Promise<SupportRequestDocument | undefined> {
        return await this.SupportRequestModel.findById(id).populate(this.populateParams()).select('-__v').exec();
    }

    public canAccessRequest(request: SupportRequest, user: User) {
        if ([UserRoleEnum.client as string].includes(user.role) && request.userId !== user.id) {
            return false;
        }
        return true;
    }

    private populateParams() {
        return [
            "user",
            { path: 'messages', populate: { path: 'author' } },
        ]
    }
}
