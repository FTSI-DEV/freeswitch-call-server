import { Test, TestingModule } from '@nestjs/testing';
import { OutboundCallService } from './outbound-call.service';

describe('OutboundCallService', () => {
  let service: OutboundCallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutboundCallService],
    }).compile();

    service = module.get<OutboundCallService>(OutboundCallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
