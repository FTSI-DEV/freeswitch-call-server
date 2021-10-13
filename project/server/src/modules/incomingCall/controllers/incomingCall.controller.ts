import { Controller, Get, Query } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';

@Controller('inbound-call')
export class IncomingCallController {
  constructor(@InjectQueue('default')
              private incomingCallJob: Queue
              ) {}

  @Get('incomingStatusCallback')
  incomingStatusCallBack(@Query() callData:CDRModel):JsonDataListReturnModel{

    console.log('IncomingCall/IncomingStatusCallBack' , callData);

    this.incomingCallJob.add('inboundCall', callData);
    
    return JsonDataListReturnModel.Ok("Successfully submitted to job queue");
  }
}
