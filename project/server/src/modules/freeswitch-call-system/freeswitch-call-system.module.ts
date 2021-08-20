import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FsCallDetailRecordEntity, FsCallDetailRecordRepository } from 'src/entity/freeswitchCallDetailRecord.entity';
import { FREESWITCH_SERVICE } from '../freeswitch/freeswitch.interface';
import { FreeswitchCallSystemController } from './controllers/freeswitch-call-system.controller';
import { FreeswitchCallSystemService } from './services/freeswitch-call-system.service';

@Module({
  providers: [
    FreeswitchCallSystemService
  ],
  imports: [TypeOrmModule.forFeature([FsCallDetailRecordEntity, FsCallDetailRecordRepository])],
  exports: [FreeswitchCallSystemService],
  controllers: [FreeswitchCallSystemController]
})
export class FreeswitchCallSystemModule {}