import { Module } from '@nestjs/common';
import { IncomingCallController } from './incomingCall.controller';
import { IncomingCallService } from './incomingCall.service';

@Module({
    controllers: [IncomingCallController],
    providers: [IncomingCallService],
})
export class IncomingCallModule {}
