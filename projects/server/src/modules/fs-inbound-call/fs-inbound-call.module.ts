import { Module } from '@nestjs/common';
import { FsInboundCallService } from './fs-inbound-call.service';
import { FsInboundCallController } from './fs-inbound-call.controller';

@Module({
  providers: [FsInboundCallService],
  controllers: [FsInboundCallController]
})
export class FsInboundCallModule {}
