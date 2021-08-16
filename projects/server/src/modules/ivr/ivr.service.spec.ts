import { Test, TestingModule } from '@nestjs/testing';
import { IvrService } from './ivr.service';

describe('IvrService', () => {
  let service: IvrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IvrService],
    }).compile();

    service = module.get<IvrService>(IvrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
