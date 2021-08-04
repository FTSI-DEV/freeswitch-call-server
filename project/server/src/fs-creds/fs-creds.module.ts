import { Module } from '@nestjs/common';
import { FsCredsService } from './fs-creds.service';

@Module({
  providers: [FsCredsService],
  exports: [FsCredsService],
  imports: [FsCredsService]
})
export class FsCredsModule {}
