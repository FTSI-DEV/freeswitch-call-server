import { Controller, Get, Query } from '@nestjs/common';
import { IncomingCallService } from './incomingCall.service'
import { processCallEnter, processCallVerify, waitingToConnect } from './IncomingCallWorker';
@Controller('NewInboundCall')
export class IncomingCallController {
  constructor(private incomingCallService: IncomingCallService) {}
  
  @Get('IncomingCallEnter')
  getIncomingCallEnter(@Query('StoreId') StoreId:string,@Query('SystemId') SystemId:string): any {
    const callData = { StoreId, SystemId };
    if (StoreId && SystemId)
      processCallEnter(callData)
  }

  @Get('IncomingCallVerify')
  getIncomingCallVerify(@Query('StoreId') StoreId:string, @Query('SystemId') SystemId:string): any {
    const callData = { StoreId, SystemId };
    if (StoreId && SystemId)
      processCallVerify(callData)
  }

  @Get('WaitingToConnect')
  getWaitingToConnect(@Query('StoreId') StoreId:string,@Query('SystemId') SystemId:string): any {
    const callData = { StoreId, SystemId };
    if (StoreId && SystemId)
      waitingToConnect(callData)
  }
}
