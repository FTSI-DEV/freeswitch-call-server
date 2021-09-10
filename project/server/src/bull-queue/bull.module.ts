import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CallDetailRecordModule } from 'src/modules/call-detail-record/call-detail-record.module';
import { CallRecordingModule } from 'src/modules/call-recording/call-recording.module';
import { IncomingCallModule } from 'src/modules/incomingCall/incomingCall.module';
import { IncomingCallJob as IncomingCallProcessor } from './incomingCall/incomingCall.job';
import { OutboundCallJob as OutboundCallProcessor } from './outboundCall/outboundCallJob';
import { TestController } from './test.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'default',
    }),
    CallDetailRecordModule,
    CallRecordingModule
  ],
  providers: [OutboundCallProcessor, IncomingCallProcessor],
  exports: [OutboundCallProcessor, IncomingCallProcessor, BullModule],
  controllers: [TestController]
})
export class BullModuleQueue {}
