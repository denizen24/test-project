import { Module } from '@nestjs/common';

import { SupportRequestModule } from '@base/support-request/support-request.module';

import { SupportRequestApiController } from './support-request.controller';
import { SupportRequestGateway } from './support-request.gateway';

@Module({
  imports: [SupportRequestModule],
  providers: [SupportRequestGateway],
  controllers: [SupportRequestApiController],
})
export class SupportRequestApiModule {}
