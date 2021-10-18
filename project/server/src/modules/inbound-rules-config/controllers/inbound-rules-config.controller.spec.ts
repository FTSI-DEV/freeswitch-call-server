import { Test, TestingModule } from '@nestjs/testing';
import { InboundRulesConfigController } from './inbound-rules-config.controller';

describe('InboundRulesConfigController', () => {
  let controller: InboundRulesConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InboundRulesConfigController],
    }).compile();

    controller = module.get<InboundRulesConfigController>(InboundRulesConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
