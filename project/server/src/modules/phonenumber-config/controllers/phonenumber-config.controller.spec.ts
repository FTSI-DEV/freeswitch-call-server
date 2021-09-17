import { Test, TestingModule } from '@nestjs/testing';
import { FreeswitchPhoneNumberConfigController } from './phonenumber-config.controller';

describe('FreeswitchPhoneNumberConfigController', () => {
  let controller: FreeswitchPhoneNumberConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeswitchPhoneNumberConfigController],
    }).compile();

    controller = module.get<FreeswitchPhoneNumberConfigController>(FreeswitchPhoneNumberConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
