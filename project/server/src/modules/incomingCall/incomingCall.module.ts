import { Module } from '@nestjs/common';
import { FreeswitchCallSystemModule } from '../freeswitch-call-system/freeswitch-call-system.module';
import { IncomingCallController } from './incomingCall.controller';
import { IncomingCallService } from './incomingCall.service';

@Module({
    controllers: [IncomingCallController],
    providers: [IncomingCallService],
    imports: [FreeswitchCallSystemModule]
})
export class IncomingCallModule {}
