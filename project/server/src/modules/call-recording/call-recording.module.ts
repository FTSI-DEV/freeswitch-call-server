import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecordingStorageEntity, CallRecordingStorageRepository } from 'src/entity/callRecordingStorage.entity';
import { CallDetailRecordModule } from '../call-detail-record/call-detail-record.module';
import { CallRecordingController } from './controllers/call-recording.controller';
import { CallRecordingService } from './services/call-recording.service';

@Module({
  controllers: [CallRecordingController],
  providers: [CallRecordingService],
  imports: [TypeOrmModule.forFeature([CallRecordingStorageEntity, CallRecordingStorageRepository]),
           CallDetailRecordModule],
  exports: [CallRecordingService]
})
export class CallRecordingModule {}
