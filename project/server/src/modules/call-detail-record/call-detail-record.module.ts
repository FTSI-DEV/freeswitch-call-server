import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FsCallDetailRecordEntity, FsCallDetailRecordRepository } from 'src/entity/call-detail-record';
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
  imports: [TypeOrmModule.forFeature([FsCallDetailRecordEntity, FsCallDetailRecordRepository])],
  exports: [CALL_DETAIL_RECORD_SERVICE],
  controllers: [CallDetailRecordController]
})
export class CallDetailRecordModule {}