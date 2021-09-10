import { Controller, Get, Query } from '@nestjs/common';
import { Queue } from 'bull';
import { IncomingCallService } from './incomingCall.service';
import { InjectQueue } from '@nestjs/bull';
import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import { FreeswitchPhoneNumberConfigService } from '../config/fs-phonenumber-config/services/phonenumber-config.service';
import { CallDetailRecordService } from '../call-detail-record/services/call-detail-record.service';

@Controller('NewInboundCall')
export class IncomingCallController {
  constructor(private incomingCallService: IncomingCallService,
              private freeswitchCallConfig: FreeswitchPhoneNumberConfigService,
              private freeswitchCallSystemService: CallDetailRecordService,
              @InjectQueue('default')
              private incomingCallJob: Queue
              ) 
              {}

  @Get('IncomingStatusCallBack')
  incomingStatusCallBack(@Query() callData:CDRModel){

    console.log('IncomingCall/IncomingStatusCallBack' , callData);

    this.incomingCallJob.add('inboundCall', callData);
    
    return "Successfully submitted to job queue";
  }
}
