import { ID } from "src/types/ID";

export interface ReservationSearchOptions {
  userId?: ID;
  dateStart?: Date;
  dateEnd?: Date;
  roomId?: ID;
}
