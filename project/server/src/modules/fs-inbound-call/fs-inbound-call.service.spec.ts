import { Test, TestingModule } from '@nestjs/testing';
import { FsInboundCallService } from './fs-inbound-call.service';

describe('FsInboundCallService', () => {
  let service: FsInboundCallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FsInboundCallService],
    }).compile();

    service = module.get<FsInboundCallService>(FsInboundCallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
