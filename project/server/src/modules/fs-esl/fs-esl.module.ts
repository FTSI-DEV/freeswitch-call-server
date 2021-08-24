import { Module } from '@nestjs/common';
import { PhoneNumberConfigModule } from '../config/fs-phonenumber-config/phonenumber-config.module';
import { FreeswitchCallSystemModule } from '../freeswitch-call-system/freeswitch-call-system.module';
import { FS_ESL_SERVICE } from './fs-esl.interface';
import { FsEslService } from './fs-esl.service';
import { FreeswitchController } from './fs.esl.controller';

@Module({
  providers: [FsEslService],
  exports: [FsEslService],
  imports: [PhoneNumberConfigModule, FreeswitchCallSystemModule],
  controllers: [FreeswitchController]
})
export class FsEslModule {}
