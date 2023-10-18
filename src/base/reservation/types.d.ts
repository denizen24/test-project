interface AddReservationParams {
  userId: ID;
  hotelId: ID;
  roomId: ID;
  dateStart: Date;
  dateEnd: Date;
}

interface ReservationSearchParams {
  userId: ID;
  dateStart?: Date;
  dateEnd?: Date;
}
interface IReservationService {
  addReservation(data: AddReservationParams): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(filter: ReservationSearchParams): Promise<Array<Reservation>>;
}
