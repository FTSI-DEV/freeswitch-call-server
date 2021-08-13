import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeswitchCallSystemService } from './freeswitch-call-system.service';

@Module({
  providers: [FreeswitchCallSystemService],
  imports: [TypeOrmModule.forFeature([FreeswitchCallSystemService])],
  exports: [FreeswitchCallSystemService]
})
export class FreeswitchCallSystemModule {}