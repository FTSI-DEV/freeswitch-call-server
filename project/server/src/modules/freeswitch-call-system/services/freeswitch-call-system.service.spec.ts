import { Test, TestingModule } from '@nestjs/testing';
import { FreeswitchCallSystemService } from './freeswitch-call-system.service';

describe('FreeswitchCallSystemService', () => {
  let service: FreeswitchCallSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreeswitchCallSystemService],
    }).compile();

    service = module.get<FreeswitchCallSystemService>(FreeswitchCallSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
