import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { iUser } from "src/interfaces/user.interface";
import { ID } from "src/types/ID";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements iUser {
  id: ID;

  @Prop( { required: [true, 'Не указан email'], unique: [true, 'Пользователь с таким email уже есть'] })
  email: string;

  @Prop( { required: [true, 'Не указан пароль'] })
  passwordHash: string;

  @Prop( { required: [true, 'Не указано имя'] })
  name: string;

  @Prop( { required: false })
  contactPhone: string;

  @Prop( { required: true, default: 'client' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
