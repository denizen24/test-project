import { Test, TestingModule } from '@nestjs/testing';

import { ReservationService } from '@base/reservation/service';

import { ReservationApiController } from './reservation.controller';

describe('ReservationApiController', () => {
  let controller: ReservationApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationApiController],
      providers: [ReservationService],
    }).compile();

    controller = module.get<ReservationApiController>(ReservationApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
