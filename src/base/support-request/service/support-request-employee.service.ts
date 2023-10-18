import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { USER_ROLE } from '@common/enums';

import { User } from '@base/user/schemas/user.schema';

import { Message, SupportRequest } from '../schema';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Предполагается что прочитанными помечаются только сообщения от клиента, но прямого доступа к его ID у нас нет
  // Поэтому фильтруем сообщения по роли автора - помечаем прочитанными только сообщения НЕ ОТ менеджеров
  async markMessagesAsRead({
    supportRequest,
    createdBefore,
  }: MarkMessagesAsReadParams) {
    const supportRequestDocument =
      await this.supportRequestModel.findById(supportRequest);
    const messageIds = supportRequestDocument.get('messages');

    const managerUsers = await this.userModel
      .find({ role: USER_ROLE.MANAGER })
      .select('_id');

    return await this.messageModel
      .updateMany(
        {
          _id: { $in: messageIds },
          author: { $nin: managerUsers },
          sentAt: { $lte: createdBefore },
        },
        { $set: { readAt: new Date() } },
      )
      .exec();
  }

  async getUnreadCount(supportRequest: string): Promise<number> {
    const user = await this.supportRequestModel
      .findById(supportRequest)
      .get('user');

    const count = await this.messageModel
      .countDocuments({
        supportRequest,
        user,
        isRead: false,
      })
      .exec();

    return count;
  }

  async closeRequest(supportRequestId: string): Promise<void> {
    await this.supportRequestModel.updateOne(
      {
        _id: supportRequestId,
      },
      {
        isActive: false,
      },
    );
  }
}
