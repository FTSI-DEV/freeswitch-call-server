import {
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CallDetailRecordDTO } from 'src/modules/call-detail-record/models/cdr.models';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { CALL_DETAIL_RECORD_SERVICE, ICallDetailRecordService } from '../services/call-detail-record.interface';

@Controller('/call-detail-record')
export class CallDetailRecordController {
  constructor(
    @Inject(CALL_DETAIL_RECORD_SERVICE)
    private readonly _callDetailRecordService: ICallDetailRecordService,
  ) {}

  @Get('getCdrLogs')
  async getCallLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<JsonDataListReturnModel> {

    limit = limit > 10 ? 10 : limit;

    let callLogs = await this._callDetailRecordService.getCallLogs({
      page,
      limit
    });

    return JsonDataListReturnModel.Ok(null, callLogs);
  }

  @Get('getCDRById/:id')
  async getCDRById(@Param('id') id: number): Promise<JsonDataListReturnModel>{

    let record =  await this._callDetailRecordService.getById(id);

    if (record != null){
      let retVal : CallDetailRecordDTO = {
        Id: record.Id,
        CallUUID: record.CallUid,
        ParentCallUid: record.ParentCallUid,
        CallDirection : record.CallDirection,
        CallStatus: record.CallStatus,
        Duration : record.CallDuration,
        DateCreated: record.DateCreated,
        PhoneNumberFrom : record.PhoneNumberFrom,
        PhoneNumberTo : record.PhoneNumberTo
      }

      return JsonDataListReturnModel.Ok(null,retVal);
    }

    return JsonDataListReturnModel.Ok('No records to be displayed');
  }
}
