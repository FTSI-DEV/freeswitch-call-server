import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserAuthMiddleware } from 'src/auth/middlewares/user-auth.middleware';
// import { UserAuthMiddleware } from 'src/auth/middlewares/user-auth.middleware';
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
           CallDetailRecordModule,
          AuthModule],
  exports: [CALL_RECORDING_SERVICE]
})
export class CallRecordingModule implements NestModule {
  public configure(consumer:MiddlewareConsumer){
    consumer
        .apply(UserAuthMiddleware)
        .forRoutes(
          { path: 'call-recording/deleteCallRecording/:recordingId' , method: RequestMethod.GET },
          { path: 'call-recording/getCallRecordings' , method: RequestMethod.GET },
          { path: 'call-recording/getCallRecord/:recordingId', method: RequestMethod.GET },
          { path: 'call-recording/getRecordFile/:recordingId', method: RequestMethod.GET }
        )
  }
}
