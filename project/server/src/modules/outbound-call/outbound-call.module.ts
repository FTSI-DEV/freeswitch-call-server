import { Module } from '@nestjs/common';
import { BullModuleQueue } from 'src/bull-queue/bull.module';
import { CallDetailRecordModule } from '../call-detail-record/call-detail-record.module';
import { OutboundCallController } from './controllers/outbound-call.controller';
import { OutboundCallService } from './services/outbound-call.service';

@Module({
    providers: [OutboundCallService],
    exports: [OutboundCallService],
    imports: [CallDetailRecordModule, BullModuleQueue],
    controllers: [OutboundCallController]
})
export class OutboundCallModule {}
