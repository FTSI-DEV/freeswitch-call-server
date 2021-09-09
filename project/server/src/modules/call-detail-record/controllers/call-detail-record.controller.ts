import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CallDetailRecordDTO } from 'src/models/cdr.models';
import { CallDetailRecordService } from '../services/call-detail-record.service';

@Controller('/call-detail-record')
export class CallDetailRecordController {
  constructor(
    private readonly _freeswitchCallSystemService: CallDetailRecordService,
  ) {}

  @Get('getCdrLogs')
  getCallLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<CallDetailRecordDTO>> {
    limit = limit > 100 ? 100 : limit;
    return this._freeswitchCallSystemService.getCallLogs({
      page,
      limit
    });
  }

  @Get('getCDRById/:id')
  getCDRById(@Param('id') id: number): CallDetailRecordDTO{
    return this._freeswitchCallSystemService.getById(id);
  }
}
