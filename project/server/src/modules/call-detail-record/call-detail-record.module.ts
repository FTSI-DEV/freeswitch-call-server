import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FsCallDetailRecordEntity, FsCallDetailRecordRepository } from 'src/entity/call-detail-record';
import { FREESWITCH_SERVICE } from '../freeswitch/freeswitch.interface';
import { CallDetailRecordController } from './controllers/call-detail-record.controller';
import { CallDetailRecordService } from './services/call-detail-record.service';

@Module({
  providers: [
    CallDetailRecordService
  ],
  imports: [TypeOrmModule.forFeature([FsCallDetailRecordEntity, FsCallDetailRecordRepository])],
  exports: [CallDetailRecordService],
  controllers: [CallDetailRecordController]
})
export class CallDetailRecordModule {}