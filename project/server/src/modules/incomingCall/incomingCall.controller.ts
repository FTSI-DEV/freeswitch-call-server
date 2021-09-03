import { Controller, Get, Query } from '@nestjs/common';
import { Queue } from 'bull';
import { IncomingCallService } from './incomingCall.service';
import { InjectQueue } from '@nestjs/bull';
import { CDRModels } from 'src/models/cdr.models';
import { FreeswitchPhoneNumberConfigService } from '../config/fs-phonenumber-config/services/phonenumber-config.service';
import { FreeswitchCallSystemService } from '../freeswitch-call-system/services/freeswitch-call-system.service';

@Controller('NewInboundCall')
export class IncomingCallController {
  constructor(private incomingCallService: IncomingCallService,
              private freeswitchCallConfig: FreeswitchPhoneNumberConfigService,
              private freeswitchCallSystemService: FreeswitchCallSystemService,
              @InjectQueue('default')
              private incomingCallJob: Queue
              ) 
              {}

  @Get('IncomingStatusCallBack')
  incomingStatusCallBack(@Query() callData:CDRModels){

    console.log('IncomingCall/IncomingStatusCallBack' , callData);

    this.incomingCallJob.add('inboundCall', callData);
    
    return "Successfully submitted to job queue";
  }
}
