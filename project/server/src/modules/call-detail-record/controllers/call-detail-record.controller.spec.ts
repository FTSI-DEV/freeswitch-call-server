import { Test, TestingModule } from '@nestjs/testing';
import { CallDetailRecordController } from './call-detail-record.controller';

describe('CallDetailRecordController', () => {
  let controller: CallDetailRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallDetailRecordController],
    }).compile();

    controller = module.get<CallDetailRecordController>(CallDetailRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
