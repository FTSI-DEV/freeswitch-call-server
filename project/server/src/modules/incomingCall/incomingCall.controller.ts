import { Controller, Get, Query } from '@nestjs/common';
import { IncomingCallService } from './incomingCall.service'
import { callEnter, callVerify, waitingToConnect } from '../../jobs/IncomingCall';
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
  incomingStatusCallBack(callData:any){
    console.log('CALL DATA' , callData);
    const record = this.incomingCallService.incomingStatusCallBack(callData);

  }
}
