import { ObjectId } from "mongoose";

export interface iReservation {
  userId: ObjectId;
  roomId: ObjectId;
  dateStart: Date;
  dateEnd: Date;
}
