import { Module } from '@nestjs/common';
import { BullModuleQueue } from 'src/bull-queue/bull.module';
import { CallDetailRecordModule } from '../call-detail-record/call-detail-record.module';
import { OutboundCallController } from './controllers/outbound-call.controller';
import { OUTBOUND_CALL_SERVICE } from './services/outbound-call.interface';
import { OutboundCallService } from './services/outbound-call.service';

@Module({
    providers: [{
        useClass: OutboundCallService,
        provide: OUTBOUND_CALL_SERVICE
    }],
    exports: [OUTBOUND_CALL_SERVICE],
    imports: [CallDetailRecordModule, BullModuleQueue],
    controllers: [OutboundCallController]
})
export class OutboundCallModule {}
