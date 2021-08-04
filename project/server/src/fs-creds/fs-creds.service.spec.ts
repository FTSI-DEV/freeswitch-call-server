import { Test, TestingModule } from '@nestjs/testing';
import { FsCredsService } from './fs-creds.service';

describe('FsCredsService', () => {
  let service: FsCredsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FsCredsService],
    }).compile();

    service = module.get<FsCredsService>(FsCredsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
