import { Module } from '@nestjs/common';
import { FS_ESL_SERVICE } from './fs-esl.interface';
import { FsEslService } from './fs-esl.service';

@Module({
  providers: [{
    useClass: FsEslService,
    provide: FS_ESL_SERVICE
  }],
  imports: [FsEslService],
  exports: [FsEslService]
})
export class FsEslModule {}
