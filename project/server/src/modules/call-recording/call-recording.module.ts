import { Module } from '@nestjs/common';
import { CallRecordingController } from './call-recording.controller';
import { CallRecordingService } from './call-recording.service';

@Module({
  controllers: [CallRecordingController],
  providers: [CallRecordingService]
})
export class CallRecordingModule {}
