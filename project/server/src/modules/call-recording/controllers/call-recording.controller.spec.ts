import { Test, TestingModule } from '@nestjs/testing';
import { CallRecordingController } from './call-recording.controller';

describe('CallRecordingController', () => {
  let controller: CallRecordingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallRecordingController],
    }).compile();

    controller = module.get<CallRecordingController>(CallRecordingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
