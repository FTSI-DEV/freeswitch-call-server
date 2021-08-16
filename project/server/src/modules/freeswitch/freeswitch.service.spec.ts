import { Test, TestingModule } from '@nestjs/testing';
import { FreeswitchService } from './freeswitch.service';

describe('FreeswitchService', () => {
  let service: FreeswitchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreeswitchService],
    }).compile();

    service = module.get<FreeswitchService>(FreeswitchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
