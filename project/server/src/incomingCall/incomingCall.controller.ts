import { Controller, Get, Query } from '@nestjs/common';
import { IncomingCallService } from './incomingCall.service'
import { callEnter, callVerify, waitingToConnect } from './IncomingCallWorker';
@Controller('NewInboundCall')
export class IncomingCallController {
  constructor(private incomingCallService: IncomingCallService) {}
  
  @Get('IncomingCallEnter')
  getIncomingCallEnter(@Query('StoreId') StoreId:string,@Query('SystemId') SystemId:string): any {
    const callData = { StoreId, SystemId };
    if (StoreId && SystemId)
      callEnter(callData)
  }

  @Get('IncomingCallVerify')
  getIncomingCallVerify(@Query('StoreId') StoreId:string, @Query('SystemId') SystemId:string): any {
    const callData = { StoreId, SystemId };
    if (StoreId && SystemId)
      callVerify(callData)
  }

  @Get('WaitingToConnect')
  getWaitingToConnect(@Query('StoreId') StoreId:string,@Query('SystemId') SystemId:string): any {
    const callData = { StoreId, SystemId };
    if (StoreId && SystemId)
      waitingToConnect(callData)
  }
}
