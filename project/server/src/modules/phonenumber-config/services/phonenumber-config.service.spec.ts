import { Test, TestingModule } from '@nestjs/testing';
import { PhoneNumberConfigService } from './phonenumber-config.service';

describe('FreeswitchPhoneNumberConfigService', () => {
  let service: PhoneNumberConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneNumberConfigService],
    }).compile();

    service = module.get<PhoneNumberConfigService>(PhoneNumberConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
