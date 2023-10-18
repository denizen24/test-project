import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Reservation, ReservationSchema } from './schema';
import { ReservationService } from './service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
