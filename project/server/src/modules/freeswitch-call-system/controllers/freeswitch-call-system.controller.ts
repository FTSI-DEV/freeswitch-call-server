import {
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FsCallDetailRecordEntity } from 'src/entity/freeswitchCallDetailRecord.entity';
import { FREESWITCH_SERVICE } from 'src/modules/freeswitch/freeswitch.interface';
import { IFreeswitchCallSystemService } from '../services/freeswitch-call-system.interface';
import { FreeswitchCallSystemService } from '../services/freeswitch-call-system.service';

@Controller('freeswitch-call-system')
export class FreeswitchCallSystemController {
  constructor(
    private readonly _freeswitchCallSystemService: FreeswitchCallSystemService,
  ) {}

  @Get('getCdrLogs')
  getCallLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<FsCallDetailRecordEntity>> {
    limit = limit > 100 ? 100 : limit;
    return this._freeswitchCallSystemService.getCallLogs({
      page,
      limit,
      route: 'http://cats.com/cats',
    });
  }
}
