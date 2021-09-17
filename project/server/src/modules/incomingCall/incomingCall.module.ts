import { Module } from '@nestjs/common';
import { BullModuleQueue } from 'src/bull-queue/bull.module';
import { CallDetailRecordModule } from '../call-detail-record/call-detail-record.module';
import { IncomingCallController } from './controllers/incomingCall.controller';
import { INCOMING_CALL_SERVICE } from './services/incomingCall.interface';
import { IncomingCallService } from './services/incomingCall.service';

@Module({
    controllers: [IncomingCallController],
    providers: [{
        useClass: IncomingCallService,
        provide: INCOMING_CALL_SERVICE
    }],
    imports: [CallDetailRecordModule, BullModuleQueue]
})
export class IncomingCallModule {}
