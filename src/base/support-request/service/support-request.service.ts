import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Message, SupportRequest } from '../schema';
import { MessageDocument } from '../schema/message.schema';
import { SupportRequestDocument } from '../schema/support-request.schema';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async findSupportRequestById(id: string): Promise<SupportRequestDocument> {
    return await this.supportRequestModel.findById(id);
  }

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    const searchParams = {};

    if (params.user) {
      searchParams['user'] = params.user;
    }

    if (params.isActive) {
      searchParams['isActive'] = params.isActive;
    }

    const query = this.supportRequestModel.find(searchParams);

    if (params.offset) {
      query.skip(params.offset);
    }

    if (params.limit) {
      query.limit(params.limit);
    }

    return await query.populate('user').exec();
  }

  async sendMessage(data: SendMessageParams): Promise<MessageDocument> {
    const message = new this.messageModel({
      ...data,
      sentAt: new Date(),
    });
    const savedMessage = await message.save();

    await this.supportRequestModel.findByIdAndUpdate(data.supportRequest, {
      $push: { messages: message._id },
    });

    return await savedMessage.populate('author');
  }

  async getMessages(supportRequest: string): Promise<MessageDocument[]> {
    const request = await this.supportRequestModel
      .findById(supportRequest)
      .populate({
        path: 'messages',
        populate: {
          path: 'author',
        },
      });

    return request.get('messages') as MessageDocument[];
  }

  subscribe(
    handler: (
      supportRequest: SupportRequestDocument,
      message: MessageDocument,
    ) => void,
  ) {
    const supportRequest = this.supportRequestModel.watch();

    supportRequest.on('change', (change) => {
      if (change.operationType === 'insert') {
        const message = change.fullDocument.messages.pop();

        handler(change.fullDocument, message);
      }
    });
  }
}
