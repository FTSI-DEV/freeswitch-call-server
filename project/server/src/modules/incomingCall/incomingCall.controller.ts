import { Body, Controller, Get, Query } from '@nestjs/common';
import { IncomingCallService } from './incomingCall.service';
import { CDRModels } from 'src/models/cdr.models';
@Controller('NewInboundCall')
export class IncomingCallController {
  constructor(private incomingCallService: IncomingCallService) {}
  
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

    return "Successfully saved record";
  }
}
