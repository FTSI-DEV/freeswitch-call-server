import { Module } from '@nestjs/common';
import { BullModuleQueue } from 'src/bull-queue/bull.module';
import { PhoneNumberConfigModule } from '../config/fs-phonenumber-config/phonenumber-config.module';
import { CallDetailRecordModule } from '../call-detail-record/call-detail-record.module';
import { IncomingCallController } from './incomingCall.controller';
import { IncomingCallService } from './incomingCall.service';

@Module({
    controllers: [IncomingCallController],
    providers: [IncomingCallService],
    imports: [CallDetailRecordModule, PhoneNumberConfigModule, BullModuleQueue]
})
export class IncomingCallModule {}
