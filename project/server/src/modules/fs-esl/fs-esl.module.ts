import { Module } from '@nestjs/common';
import { FS_ESL_SERVICE } from './fs-esl.interface';
import { FsEslService } from './fs-esl.service';
import { FreeswitchController } from './fs.esl.controller';

@Module({
  providers: [FsEslService],
  exports: [FsEslService],
  controllers: [FreeswitchController]
})
export class FsEslModule {}
