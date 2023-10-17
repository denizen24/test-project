import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserRoleEnum } from "src/enums/user-role.enum";
import { ID } from "src/types/ID";
import { CreateSupportRequest } from "./interfaces/create-support-request.interface";
import { MarkMessagesAsRead } from "./interfaces/mark-messages-as-read.interface";
import { ISupportRequestClientService } from "./interfaces/support-request-client-service.interface";
import { Message } from "./mongo.schemas/message.schema";
import { SupportRequest, SupportRequestDocument } from "./mongo.schemas/support-request.schema";
import { SupportRequestService } from "./support-request.service";

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {

    // TODO: Оповещения должны быть реализованы через механизм EventEmitter.

    constructor(
      @InjectModel(SupportRequest.name) private SupportRequestModel: Model<SupportRequestDocument>,
      private requestService: SupportRequestService,
    ) {}

    public async createSupportRequest(data: CreateSupportRequest): Promise<SupportRequest> {
        const model = new this.SupportRequestModel(data);
        model.createdAt = new Date();
        model.isActive = true;
        await model.save();
        await this.requestService.sendMessage(model, {
            authorId: model.userId,
            supportRequest: model.id,
            text: data.text,
        })
        return model;
    }

    public async markMessagesAsRead(request: SupportRequest, params: MarkMessagesAsRead): Promise<void> {
        request?.messages
          .filter(message => !message.readAt)
          .filter(message => message.authorId != params.user)
          .filter(message => message.sentAt < params.createdBefore)
          .forEach(message => {
              message.readAt = new Date();
              message.save();
          })
    }

    public async getUnreadCount(supportRequest: ID): Promise<Message[]> {
        return (await this.requestService.findById(supportRequest))
          ?.messages
          .filter(message => message.author?.role != UserRoleEnum.client)
          .filter(message => !message.readAt) || [];
    }
}
