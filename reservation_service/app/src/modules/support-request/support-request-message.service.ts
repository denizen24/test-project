import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from "src/types/ID";
import { SendMessage } from "./interfaces/send-message.interface";
import { Message, MessageDocument } from "./mongo.schemas/message.schema";

@Injectable()
export class SupportRequestMessageService {
    constructor(
      @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    ) {}

    public async addMessage(data: SendMessage): Promise<MessageDocument> {
        let message = new this.MessageModel();
        message.sentAt = new Date();
        message.text = data.text;
        message.authorId = data.authorId;
        await message.save();
        return await this.findById(message.id);
    }

    public async findById(id: ID): Promise<MessageDocument | undefined> {
        return await this.MessageModel.findById(id).populate(this.populateParams()).select('-__v').exec();
    }

    private populateParams() {
        return [
            "author",
        ]
    }
}
