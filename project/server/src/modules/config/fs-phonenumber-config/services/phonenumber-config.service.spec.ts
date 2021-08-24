import { Test, TestingModule } from '@nestjs/testing';
import { FreeswitchPhoneNumberConfigService } from './phonenumber-config.service';

describe('FreeswitchCallConfigService', () => {
  let service: FreeswitchPhoneNumberConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreeswitchPhoneNumberConfigService],
    }).compile();

    service = module.get<FreeswitchPhoneNumberConfigService>(FreeswitchPhoneNumberConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
