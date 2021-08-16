import { Test, TestingModule } from '@nestjs/testing';
import { FreeswitchCallSystemController } from './freeswitch-call-system.controller';

describe('FreeswitchCallSystemController', () => {
  let controller: FreeswitchCallSystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeswitchCallSystemController],
    }).compile();

    controller = module.get<FreeswitchCallSystemController>(FreeswitchCallSystemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
