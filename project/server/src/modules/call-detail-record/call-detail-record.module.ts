import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserAuthMiddleware } from 'src/auth/middlewares/user-auth.middleware';
import { FsCallDetailRecordEntity, FsCallDetailRecordRepository } from 'src/entity/callRecordingStorage.entity';
import { CallDetailRecordController } from './controllers/call-detail-record.controller';
import { CALL_DETAIL_RECORD_SERVICE } from './services/call-detail-record.interface';
import { CallDetailRecordService } from './services/call-detail-record.service';

@Module({
  providers: [
    {
      useClass: CallDetailRecordService,
      provide: CALL_DETAIL_RECORD_SERVICE
    }
  ],
  imports: [
    TypeOrmModule.forFeature([FsCallDetailRecordEntity, FsCallDetailRecordRepository]),
    AuthModule
  ],
  exports: [CALL_DETAIL_RECORD_SERVICE],
  controllers: [CallDetailRecordController]
})
export class CallDetailRecordModule implements NestModule {
  public configure(consumer:MiddlewareConsumer){
        consumer
            .apply(UserAuthMiddleware)
            .forRoutes(
              { path: '/**' ,  method: RequestMethod.ALL }
            )
    }
}