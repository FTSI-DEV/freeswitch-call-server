import { Test, TestingModule } from '@nestjs/testing';
import { InboundCallConfigService } from './inbound-call-config.service';

describe('InboundCallConfigService', () => {
  let service: InboundCallConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InboundCallConfigService],
    }).compile();

    service = module.get<InboundCallConfigService>(InboundCallConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
