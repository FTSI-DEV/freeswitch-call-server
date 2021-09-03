import { Module } from '@nestjs/common';
import { BullModuleQueue } from 'src/bull-queue/bull.module';
import { FreeswitchCallSystemModule } from '../freeswitch-call-system/freeswitch-call-system.module';
import { OutboundCallController } from './controllers/outbound-call.controller';
import { OutboundCallService } from './services/outbound-call.service';

@Module({
    providers: [OutboundCallService],
    exports: [OutboundCallService],
    imports: [FreeswitchCallSystemModule, BullModuleQueue],
    controllers: [OutboundCallController]
})
export class OutboundCallModule {}
