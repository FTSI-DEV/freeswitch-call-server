import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { FreeswitchCallSystemModule } from 'src/modules/freeswitch-call-system/freeswitch-call-system.module';
import { IncomingCallModule } from 'src/modules/incomingCall/incomingCall.module';
import { ClickToCallJob as ClickToCallProcessor } from './clickToCall/click-to-call.job';
import { sampleJob } from './clickToCall/sampleJob';
import { TestController } from './test.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'default',
    }),
    FreeswitchCallSystemModule
  ],
  providers: [ClickToCallProcessor, sampleJob],
  exports: [ClickToCallProcessor, BullModule],
  controllers: [TestController]
})
export class BullModuleQueue {}
