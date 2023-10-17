import { Injectable } from "@nestjs/common";
import { HotelsRoomFormatter } from "src/modules/hotels/hotels-room.formatter";
import { HotelsFormatter } from "src/modules/hotels/hotels.formatter";
import { Reservation } from "src/modules/reservations/mongo.schemas/reservation.schema";

@Injectable()
export class ReservationsFormatter {

    constructor(
      private hotelsFormatter: HotelsFormatter,
      private hotelsRoomFormatter: HotelsRoomFormatter,
    ) {}

    public format(reservation: Reservation) {
        const { id, dateStart, dateEnd } = reservation;
        return {
            id: id,
            startDate: dateStart,
            endDate: dateEnd,
            hotelRoom: reservation.room ? this.hotelsRoomFormatter.formatForClient(reservation.room) : null,
            hotel: reservation.room?.hotel ? this.hotelsFormatter.formatForClient(reservation.room.hotel) : null,
        };
    }
}
