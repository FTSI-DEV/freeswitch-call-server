import { Test, TestingModule } from '@nestjs/testing';
import { FsInboundCallController } from './fs-inbound-call.controller';

describe('FsInboundCallController', () => {
  let controller: FsInboundCallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FsInboundCallController],
    }).compile();

    controller = module.get<FsInboundCallController>(FsInboundCallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
