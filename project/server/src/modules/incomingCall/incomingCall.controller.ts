import { Body, Controller, Get, Query } from '@nestjs/common';
import { IncomingCallService } from './incomingCall.service';
import { CDRModels } from 'src/models/cdr.models';
import { FreeswitchPhoneNumberConfigService } from '../config/fs-phonenumber-config/services/phonenumber-config.service';
import { redisOptions } from 'src/beequeue/config/redisOptions.config';
import { IncomingCallJob } from 'src/beequeue/jobs/IncomingCall/incomingPhoneCallJob';
import { FreeswitchCallSystemService } from '../freeswitch-call-system/services/freeswitch-call-system.service';

const BeeQueue = require('bee-queue');
const jobQueue = new BeeQueue('default', redisOptions);

@Controller('NewInboundCall')
export class IncomingCallController {
  constructor(private incomingCallService: IncomingCallService,
              private freeswitchCallConfig: FreeswitchPhoneNumberConfigService,
              private freeswitchCallSystemService: FreeswitchCallSystemService) {}
  
  @Get('IncomingCallEnter')
  getIncomingCallEnter(@Query('StoreId') StoreId:string,@Query('SystemId') SystemId:string): any {
    const callData = { StoreId, SystemId };
    return this.incomingCallService.getIncomingCallEnter(callData);
  }

  @Get('IncomingCallVerify')
  getIncomingCallVerify(@Query('StoreId') StoreId:string, @Query('SystemId') SystemId:string): any {
    const callData = { StoreId, SystemId };
    return this.incomingCallService.getIncomingCallVerify(callData);
  }

  @Get('WaitingToConnect')
  getWaitingToConnect(@Query('StoreId') StoreId:string,@Query('SystemId') SystemId:string): any {
    const callData = { StoreId, SystemId };
    return this.incomingCallService.getWaitingToConnect(callData);
  }

  @Get('IncomingStatusCallBack')
  incomingStatusCallBack(@Query() callData:CDRModels){

    console.log('IncomingCall/IncomingStatusCallBack' , callData);

    jobQueue.createJob(callData).save();

    new IncomingCallJob(this.freeswitchCallSystemService).trigger(callData);

    return "Successfully submitted to job queue";
  }
}
