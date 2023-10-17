import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { HotelsModule } from "../hotels/hotels.module";
import { Reservation, ReservationSchema } from "./mongo.schemas/reservation.schema";
import { ReservationsClientController } from "./reservations-client.controller";
import { ReservationsManagerController } from "./reservations-manager.controller";
import { ReservationsFormatter } from "./reservations.formatter";
import { ReservationsService } from "./reservations.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    HotelsModule,
  ],
  providers: [ReservationsService, ReservationsFormatter],
  exports: [ReservationsService, ReservationsFormatter],
  controllers: [ReservationsClientController, ReservationsManagerController],
})
export class ReservationsModule {}
