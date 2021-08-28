import { Module } from '@nestjs/common';
import { BullModuleQueue } from 'src/bull-queue/bull.module';
import { PhoneNumberConfigModule } from '../config/fs-phonenumber-config/phonenumber-config.module';
import { FreeswitchCallSystemModule } from '../freeswitch-call-system/freeswitch-call-system.module';
import { IncomingCallController } from './incomingCall.controller';
import { IncomingCallService } from './incomingCall.service';

@Module({
    controllers: [IncomingCallController],
    providers: [IncomingCallService],
    imports: [FreeswitchCallSystemModule, PhoneNumberConfigModule, BullModuleQueue]
})
export class IncomingCallModule {}
