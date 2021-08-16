import { Test, TestingModule } from '@nestjs/testing';
import { FsEslService } from './fs-esl.service';

describe('FsEslService', () => {
  let service: FsEslService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FsEslService],
    }).compile();

    service = module.get<FsEslService>(FsEslService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
