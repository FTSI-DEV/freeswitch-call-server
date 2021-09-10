import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FsCallDetailRecordEntity } from 'src/entity/freeswitchCallDetailRecord.entity';
import { CallDetailRecordDTO } from 'src/modules/call-detail-record/models/cdr.models';
import { CallDetailRecordService } from '../services/call-detail-record.service';

@Controller('/call-detail-record')
export class CallDetailRecordController {
  constructor(
    private readonly _callDetailRecordService: CallDetailRecordService,
  ) {}

  @Get('getCdrLogs')
  getCallLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<CallDetailRecordDTO>> {
    limit = limit > 100 ? 100 : limit;
    return this._callDetailRecordService.getCallLogs({
      page,
      limit
    });
  }

  @Get('getCDRById/:id')
  async getCDRById(@Param('id') id: number): Promise<CallDetailRecordDTO>{

    let record =  await this._callDetailRecordService.getById(id);

    if (record != null){
      return{
        Id: record.Id,
        CallUUID: record.CallUUID,
        ParentCallUid: record.ParentCallUid,
        CallDirection : record.CallDirection,
        CallStatus: record.CallStatus,
        Duration : record.CallDuration,
        DateCreated: record.DateCreated,
        PhoneNumberFrom : record.PhoneNumberFrom,
        PhoneNumberTo : record.PhoneNumberTo
      };
    }
    return null;
  }
}
