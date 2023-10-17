import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { iHotel } from "src/interfaces/hotel.interface";
import { ID } from "src/types/ID";

export type HotelDocument = HydratedDocument<Hotel>;

@Schema()
export class Hotel implements iHotel {
  id: ID;

  @Prop( { required: [true, 'Не указано название'] })
  title: string;

  @Prop( { required: false })
  description: string;

  @Prop( { required: [true, 'Не указана дата добавления'], default: new Date()})
  createdAt: Date;

  @Prop( { required: [true, 'Не указана дата обновления'], default: new Date() })
  updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
