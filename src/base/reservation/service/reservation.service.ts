import { Model } from 'mongoose';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Reservation } from '../schema';
import { ReservationDocument } from '../schema/reservation.schema';

@Injectable()
export class ReservationService implements IReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation(
    data: AddReservationParams,
  ): Promise<ReservationDocument> {
    const { hotelId, roomId, dateStart, dateEnd } = data;
    const room = await this.reservationModel.find({ roomId });

    if (!room) {
      throw new BadRequestException('Room with given ID does not exist');
    }

    const countDocuments = await this.reservationModel.countDocuments({
      roomId,
      hotelId,
      dateStart: { $lte: new Date(dateEnd).toISOString() },
      dateEnd: { $gte: new Date(dateStart).toISOString() },
    });

    const roomAvailable = countDocuments === 0;

    if (!roomAvailable) {
      throw new BadRequestException('Room is not available');
    }

    const reservation = new this.reservationModel(data);

    return await (await reservation.save()).populate(['hotelId', 'roomId']);
  }

  async removeReservation(id: string): Promise<void> {
    await this.reservationModel.findByIdAndDelete(id);
  }

  async getReservations(
    filter: ReservationSearchParams,
  ): Promise<ReservationDocument[]> {
    const query = this.reservationModel.find(filter);

    return await query.populate(['hotelId', 'roomId']).exec();
  }
}
