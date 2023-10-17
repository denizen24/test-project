import { ID } from "src/types/ID";

export interface ReservationDto {
  userId: ID;
  roomId: ID;
  dateStart: Date;
  dateEnd: Date;
}
