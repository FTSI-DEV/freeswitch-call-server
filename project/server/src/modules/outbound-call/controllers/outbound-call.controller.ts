import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Queue } from 'bull';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { OutboundCallParam } from '../models/outbound-call.model';
import { IOutboundCallService, OUTBOUND_CALL_SERVICE } from '../services/outbound-call.interface';

@Controller('/api/outbound-call')
export class OutboundCallController {
    constructor(
        @Inject(OUTBOUND_CALL_SERVICE)
        private readonly _outboundCallService : IOutboundCallService,
        @InjectQueue('default')
        private readonly outboundCallJobQueue : Queue
    ) {}

    
    // @UseGuards(LocalAuthGuard)
    @Post('clickToCall')
    async clickToCall(
        @Body() param: OutboundCallParam
      ): Promise<JsonDataListReturnModel> {
    
        try{

          let result = await this._outboundCallService.clickToCall(
            param.phoneNumberTo,
            param.phoneNumberFrom,
            param.displayCallerId,
          );

          return JsonDataListReturnModel.Ok(result);
        }
        catch(err){
          console.log('ERR -> ', JsonDataListReturnModel.Error(err));
          return JsonDataListReturnModel.Error(err);
        }
    }

    @Get('testClickToCall')
    clickToCallTest(){
      console.log('Test achieve!');
      return "Test achieve!";
    }

    @Get('outboundCallStatusCallBack')
    outboundCallStatusCallBack(@Query() callData: CDRModel):JsonDataListReturnModel {

    this.outboundCallJobQueue.add('outboundCall',callData);

    return JsonDataListReturnModel.Ok('Successfully submitted to job queue');
  }
}
