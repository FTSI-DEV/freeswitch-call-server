import { Test, TestingModule } from '@nestjs/testing';
import { InboundRulesConfigService } from './inbound-rules-config.service';

describe('InboundRulesConfigService', () => {
  let service: InboundRulesConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InboundRulesConfigService],
    }).compile();

    service = module.get<InboundRulesConfigService>(InboundRulesConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
