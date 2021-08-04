import { Module } from '@nestjs/common';
import { FsCredsService } from './fs-creds.service';

@Module({
  providers: [FsCredsService]
})
export class FsCredsModule {}
