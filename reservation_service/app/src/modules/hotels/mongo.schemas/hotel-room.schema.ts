import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { iHotelRoom } from "src/interfaces/hotel-room.interface";
import { ID } from "src/types/ID";
import { Hotel } from "./hotel.schema";

export type HotelRoomDocument = HydratedDocument<HotelRoom>;

@Schema({
  collection: "hotel_rooms",
})
export class HotelRoom implements iHotelRoom {
  id: ID;

  @Prop( { required: [true, 'Не указан отель'], type: mongoose.Types.ObjectId })
  hotelId: ID;

  hotel: Hotel | null;

  @Prop( { required: false })
  description: string;

  @Prop( { required: false, default: [] })
  images: string[];

  @Prop( { required: [true, 'Не указана дата добавления'], default: new Date() })
  createdAt: Date;

  @Prop( { required: [true, 'Не указана дата обновления'], default: new Date() })
  updatedAt: Date;

  @Prop( { required: true, default: true })
  isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);

HotelRoomSchema.virtual("hotel", {
  ref: () => Hotel,
  localField: "hotelId",
  foreignField: "_id",
  justOne: true
});
