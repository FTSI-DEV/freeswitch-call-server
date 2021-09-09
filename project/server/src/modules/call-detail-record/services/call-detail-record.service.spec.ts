import { Test, TestingModule } from '@nestjs/testing';
import { CallDetailRecordService } from './call-detail-record.service';

describe('CallDetailRecordService', () => {
  let service: CallDetailRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallDetailRecordService],
    }).compile();

    service = module.get<CallDetailRecordService>(CallDetailRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
