import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { iReservation } from "src/interfaces/reservation.interface";
import { HotelRoom } from "src/modules/hotels/mongo.schemas/hotel-room.schema";
import { User } from "src/modules/users/mongo.schemas/user.schema";
import { ID } from "src/types/ID";

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation implements iReservation {
  id: ID;

  @Prop( { required: [true, 'Не указан пользователь'], type: mongoose.Types.ObjectId })
  userId: ObjectId;

  user: User | null;

  @Prop( { required: [true, 'Не указана комната'], type: mongoose.Types.ObjectId })
  roomId: ObjectId;

  room: HotelRoom | null;

  @Prop( { required: [true, 'Не указана дата начала'] })
  dateStart: Date;

  @Prop( { required: [true, 'Не указана дата окончания'] })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
ReservationSchema.virtual("user", {
  ref: () => User,
  localField: "userId",
  foreignField: "_id",
  justOne: true
});
ReservationSchema.virtual("room", {
  ref: () => HotelRoom,
  localField: "roomId",
  foreignField: "_id",
  justOne: true
});
