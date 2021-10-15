import { Test, TestingModule } from '@nestjs/testing';
import { IvrConfigService } from './ivr-config.service';

describe('IvrConfigService', () => {
  let service: IvrConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IvrConfigService],
    }).compile();

    service = module.get<IvrConfigService>(IvrConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
