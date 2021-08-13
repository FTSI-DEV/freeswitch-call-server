import { Test, TestingModule } from '@nestjs/testing';
import { FreeswitchCallConfigService } from './freeswitch-call-config.service';

describe('FreeswitchCallConfigService', () => {
  let service: FreeswitchCallConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreeswitchCallConfigService],
    }).compile();

    service = module.get<FreeswitchCallConfigService>(FreeswitchCallConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
