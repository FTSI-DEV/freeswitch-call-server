import { Test, TestingModule } from '@nestjs/testing';
import { FreeswitchCallConfigController } from './freeswitch-call-config.controller';

describe('FreeswitchCallConfigController', () => {
  let controller: FreeswitchCallConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeswitchCallConfigController],
    }).compile();

    controller = module.get<FreeswitchCallConfigController>(FreeswitchCallConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
