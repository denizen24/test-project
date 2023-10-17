import { Injectable } from "@nestjs/common";
import { Hotel } from "./mongo.schemas/hotel.schema";

@Injectable()
export class HotelsFormatter {

    public format(hotel: Hotel) {
        const { id, title, description } = hotel;
        return { id, title, description }
    }

    public formatForClient(hotel: Hotel) {
        const { title, description } = hotel;
        return { title, description }
    }
}
