import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallRecordingStorageEntity, CallRecordingStorageRepository } from 'src/entity/callRecordingStorage.entity';
import { CallDetailRecordModule } from '../call-detail-record/call-detail-record.module';
import { CallRecordingController } from './controllers/call-recording.controller';
import { CALL_RECORDING_SERVICE } from './services/call-recording.interface';
import { CallRecordingService } from './services/call-recording.service';

@Module({
  controllers: [CallRecordingController],
  providers: [{
    useClass: CallRecordingService,
    provide: CALL_RECORDING_SERVICE
  }],
  imports: [TypeOrmModule.forFeature([CallRecordingStorageEntity, CallRecordingStorageRepository]),
           CallDetailRecordModule],
  exports: [CALL_RECORDING_SERVICE]
})
export class CallRecordingModule {}
