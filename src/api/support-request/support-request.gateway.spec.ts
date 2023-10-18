import { Test, TestingModule } from '@nestjs/testing';

import { SupportRequestService } from '@base/support-request/service';

import { SupportRequestGateway } from './support-request.gateway';

describe('SupportRequestGateway', () => {
  let gateway: SupportRequestGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportRequestGateway, SupportRequestService],
    }).compile();

    gateway = module.get<SupportRequestGateway>(SupportRequestGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
