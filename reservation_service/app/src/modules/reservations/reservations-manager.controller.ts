import { BadRequestException, Controller, Delete, Get, Param, Request, UseGuards, } from '@nestjs/common';
import { UserRoleEnum } from "src/enums/user-role.enum";
import { ID } from "src/types/ID";
import { Roles } from "../auth/decorators/roles.decorator";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { ReservationsFormatter } from "./reservations.formatter";
import { ReservationsService } from "./reservations.service";

@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('/api/manager/reservations')
export class ReservationsManagerController {
  constructor(
    private reservationsService: ReservationsService,
    private reservationsFormatter: ReservationsFormatter,
  ) {}

  @Roles(UserRoleEnum.manager)
  @Get("/:userId")
  async reservationsList(@Param('userId') userId: ID) {
    const items = await this.reservationsService.getReservations({ userId });
    return items.map(item => this.reservationsFormatter.format(item));
  }

  @Roles(UserRoleEnum.manager)
  @Delete('/:id')
  async deleteReservation(@Param('id') id: ID, @Request() req: any) {
    const item = await this.reservationsService.findById(id);
    if (!item) {
      throw new BadRequestException('Reservation does not exist');
    }
    return await this.reservationsService.removeReservation(id);
  }
}
