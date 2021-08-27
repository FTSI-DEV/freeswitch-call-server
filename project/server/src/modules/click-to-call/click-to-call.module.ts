import { Module } from '@nestjs/common';
import { CustomLoggerModule } from 'src/logger/logger.module';
// import { ClickToCallJobModule } from 'src/beequeue/jobs/clickToCall/clickToCallJob.module';
import { PhoneNumberConfigModule } from '../config/fs-phonenumber-config/phonenumber-config.module';
import { FreeswitchCallSystemModule } from '../freeswitch-call-system/freeswitch-call-system.module';
import { FreeswitchController } from './click-to-call.controller';
import { FsEslService } from './click-to-call.service';

@Module({
  providers: [FsEslService],
  exports: [FsEslService],
  imports: [PhoneNumberConfigModule, FreeswitchCallSystemModule, CustomLoggerModule],
  controllers: [FreeswitchController]
})
export class ClickToCallModule {}
