import { Test, TestingModule } from '@nestjs/testing';
import { AccountConfigController } from './account-config.controller';

describe('AccountConfigController', () => {
  let controller: AccountConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountConfigController],
    }).compile();

    controller = module.get<AccountConfigController>(AccountConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
