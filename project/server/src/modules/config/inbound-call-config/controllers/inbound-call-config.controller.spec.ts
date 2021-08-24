import { Test, TestingModule } from '@nestjs/testing';
import { InboundCallConfigController } from './inbound-call-config.controller';

describe('InboundCallConfigController', () => {
  let controller: InboundCallConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InboundCallConfigController],
    }).compile();

    controller = module.get<InboundCallConfigController>(InboundCallConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
