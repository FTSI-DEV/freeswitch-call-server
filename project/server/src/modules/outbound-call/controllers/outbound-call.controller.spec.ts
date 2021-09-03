import { Test, TestingModule } from '@nestjs/testing';
import { OutboundCallController } from './outbound-call.controller';

describe('OutboundCallController', () => {
  let controller: OutboundCallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OutboundCallController],
    }).compile();

    controller = module.get<OutboundCallController>(OutboundCallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
