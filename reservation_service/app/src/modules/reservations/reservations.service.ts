import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ID } from "src/types/ID";
import { ReservationDto } from "./interfaces/reservation-dto.interface";
import { ReservationSearchOptions } from "./interfaces/reservation-search-options.interface";
import { IReservationService } from "./interfaces/reservation-service.interface";
import { Reservation, ReservationDocument } from "./mongo.schemas/reservation.schema";

@Injectable()
export class ReservationsService implements IReservationService {

    constructor(
      @InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
    ) {}

    public async addReservation(data: ReservationDto): Promise<ReservationDocument> {
        const {userId, ...filter} = data;
        const reservations = await this.getReservations(filter);
        if (reservations.length) {
            throw new BadRequestException('Dates are already reserved');
        }
        const model = new this.ReservationModel(data);
        await model.save();
        return await this.findById(model.id);
    }

    public async removeReservation(id: ID): Promise<void> {
        await this.ReservationModel.findByIdAndDelete(id).exec();
    }

    public async getReservations(filter: ReservationSearchOptions): Promise<ReservationDocument[]> {
        const { userId, roomId } = filter;
        const parsedFilter: any = {};
        userId && (parsedFilter.userId = userId);
        roomId && (parsedFilter.roomId = roomId);
        filter.dateStart && (parsedFilter.dateStart = { $gte: filter.dateStart });
        filter.dateEnd && (parsedFilter.dateEnd = { $lte: filter.dateEnd });
        return await this.ReservationModel.find(parsedFilter).select('-__v').populate(this.populateParams()).exec();
    }

    public async findById(id: ID): Promise<ReservationDocument | undefined> {
        return await this.ReservationModel.findById(id).populate(this.populateParams()).select('-__v').exec();
    }

    private populateParams() {
        return [
          'user',
          { path: 'room', populate: { path: 'hotel' } },
        ];
    }
}
