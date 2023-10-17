import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserRoleEnum } from "src/enums/user-role.enum";
import { ID } from "src/types/ID";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { HotelsRoomService } from "../hotels/hotels-room.service";
import { CreateReservationDto } from "../reservations/dto/create-reservation.dto";
import { ReservationsFormatter } from "./reservations.formatter";
import { ReservationsService } from "./reservations.service";

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api/client/reservations')
export class ReservationsClientController {
  constructor(
    private reservationsService: ReservationsService,
    private hotelsRoomService: HotelsRoomService,
    private reservationsFormatter: ReservationsFormatter,
  ) {}

  @Roles(UserRoleEnum.client)
  @Post("/")
  async addReservation(@Body(DtoValidationPipe) dto: CreateReservationDto, @Request() req: any) {
    const room = await this.hotelsRoomService.findById(dto.hotelRoom);
    if (!room || !room.isEnabled) {
      throw new BadRequestException('Unavailable Room');
    }
    const item = await this.reservationsService.addReservation({
      userId: req.user.id,
      roomId: dto.hotelRoom,
      dateStart: new Date(dto.startDate),
      dateEnd: new Date(dto.endDate),
    });
    return this.reservationsFormatter.format(item);
  }

  @Roles(UserRoleEnum.client)
  @Get("/")
  async reservationsList(@Request() req: any) {
    const items = await this.reservationsService.getReservations({ userId: req.user.id });
    return items.map(item => this.reservationsFormatter.format(item));
  }

  @Roles(UserRoleEnum.client)
  @Delete('/:id')
  async deleteReservation(@Param('id') id: ID, @Request() req: any) {
    const item = await this.reservationsService.findById(id);
    if (!item) {
      throw new BadRequestException('Reservation does not exist');
    }
    if (item.userId !== req.user.id) {
      throw new ForbiddenException('You can not delete reservation');
    }
    return await this.reservationsService.removeReservation(id);
  }
}
