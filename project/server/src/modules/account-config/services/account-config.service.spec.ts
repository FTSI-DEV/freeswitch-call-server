import { Test, TestingModule } from '@nestjs/testing';
import { AccountConfigService } from './account-config.service';

describe('AccountConfigService', () => {
  let service: AccountConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountConfigService],
    }).compile();

    service = module.get<AccountConfigService>(AccountConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
