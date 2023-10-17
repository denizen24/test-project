import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { iMessage } from "src/interfaces/message.interface";
import { User } from "src/modules/users/mongo.schemas/user.schema";
import { ID } from "src/types/ID";

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  collection: "support_messages",
})
export class Message implements iMessage {
  id: ID;

  @Prop( { required: [true, 'Не указан автор'], type: mongoose.Types.ObjectId })
  authorId: ID;

  author: User | null;

  @Prop( { required: [true, 'Не указана дата отправки'] })
  sentAt: Date;

  @Prop( { required: [true, 'Не указан текст сообщения'] })
  text: string;

  @Prop( { required: false })
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.virtual("author", {
  ref: () => User,
  localField: "authorId",
  foreignField: "_id",
  justOne: true
});
