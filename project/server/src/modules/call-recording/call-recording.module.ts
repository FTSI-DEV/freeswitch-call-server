import { Module } from '@nestjs/common';
import { CallRecordingController } from './controllers/call-recording.controller';
import { CallRecordingService } from './services/call-recording.service';

@Module({
  controllers: [CallRecordingController],
  providers: [CallRecordingService]
})
export class CallRecordingModule {}
