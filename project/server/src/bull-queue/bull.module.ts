import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { FreeswitchCallSystemModule } from 'src/modules/freeswitch-call-system/freeswitch-call-system.module';
import { IncomingCallModule } from 'src/modules/incomingCall/incomingCall.module';
import { IncomingCallJob as IncomingCallProcessor } from './incomingCall/incomingCall.job';
import { OutboundCallJob as OutboundCallProcessor } from './outboundCall/outboundCallJob';
import { TestController } from './test.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'default',
    }),
    FreeswitchCallSystemModule
  ],
  providers: [OutboundCallProcessor, IncomingCallProcessor],
  exports: [OutboundCallProcessor, IncomingCallProcessor, BullModule],
  controllers: [TestController]
})
export class BullModuleQueue {}
