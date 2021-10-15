import { Test, TestingModule } from '@nestjs/testing';
import { IvrConfigController } from './ivr-config.controller';

describe('IvrConfigController', () => {
  let controller: IvrConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IvrConfigController],
    }).compile();

    controller = module.get<IvrConfigController>(IvrConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
