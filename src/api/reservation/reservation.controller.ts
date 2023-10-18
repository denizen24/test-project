import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { CurrentUser } from '@common/decorators';
import { ReservationDTO } from '@common/dto';
import { MongooseClassSerializerInterceptor } from '@common/interceptors';

import { HotelDocument } from '@base/hotel/schema/hotel.schema';
import { HotelRoomService } from '@base/hotel/service';
import { ReservationService } from '@base/reservation/service';

@Controller()
@SerializeOptions({ strategy: 'excludeAll' })
export class ReservationApiController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('client/reservations')
  @UseInterceptors(MongooseClassSerializerInterceptor(ReservationDTO))
  async getClientReservations(@CurrentUser() user) {
    return await this.reservationService.getReservations({ userId: user._id });
  }

  @Get('manager/reservations/:userId')
  @UseInterceptors(MongooseClassSerializerInterceptor(ReservationDTO))
  async getManagerClientReservations(@Param('userId') userId: string) {
    return await this.reservationService.getReservations({ userId });
  }

  @Post('client/reservations')
  @UseInterceptors(MongooseClassSerializerInterceptor(ReservationDTO))
  async createClientReservation(
    @CurrentUser() user,
    @Body() data: CreateReservationParams,
  ) {
    const { startDate, endDate } = data;
    const hotelRoom = await this.hotelRoomService.findById(data.hotelRoom);

    return await this.reservationService.addReservation({
      userId: user._id,
      hotelId: (hotelRoom.hotel as HotelDocument)._id,
      roomId: hotelRoom._id,
      dateStart: new Date(startDate),
      dateEnd: new Date(endDate),
    });
  }

  @Delete('client/reservations/:id')
  async deleteClientReservation(
    @Param('íd') id: string,
    @CurrentUser() user,
  ): Promise<void> {
    if (id !== user._id) {
      throw new ForbiddenException(
        'Reservation with given ID was not found for current user',
      );
    }
    await this.reservationService.removeReservation(id);
  }

  @Delete('manager/reservations/:userId')
  async deleteManagerClientReservation(
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.reservationService.removeReservation(userId);
  }
}
