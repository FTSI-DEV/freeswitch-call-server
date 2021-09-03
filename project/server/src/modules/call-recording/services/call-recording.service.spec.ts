import { Test, TestingModule } from '@nestjs/testing';
import { CallRecordingService } from './call-recording.service';

describe('CallRecordingService', () => {
  let service: CallRecordingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallRecordingService],
    }).compile();

    service = module.get<CallRecordingService>(CallRecordingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
