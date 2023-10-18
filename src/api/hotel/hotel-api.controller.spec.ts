import { Test, TestingModule } from '@nestjs/testing';

import { HotelApiController } from './hotel-api.controller';

describe('HotelApiController', () => {
  let controller: HotelApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelApiController],
      providers: [],
    }).compile();

    controller = module.get<HotelApiController>(HotelApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
