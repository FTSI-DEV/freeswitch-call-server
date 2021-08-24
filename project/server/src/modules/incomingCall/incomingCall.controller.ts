import { Body, Controller, Get, Query } from '@nestjs/common';
import { IncomingCallService } from './incomingCall.service';
import { CDRModels } from 'src/models/cdr.models';
import { IncomingPhoneCallJob } from 'src/beequeue/jobs/IncomingCall/incomingPhoneCallJob';
import { FreeswitchPhoneNumberConfigService } from '../config/fs-phonenumber-config/services/phonenumber-config.service';
@Controller('NewInboundCall')
export class IncomingCallController {
  constructor(private incomingCallService: IncomingCallService,
              private freeswitchCallConfig: FreeswitchPhoneNumberConfigService) {}
  
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

    this.incomingCallService.incomingStatusCallBack(callData);

    new IncomingPhoneCallJob(this.freeswitchCallConfig).trigger(callData);

    return "Successfully submitted to job queue";
  }
}
