import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { Queue } from 'bull';
import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { IOutboundCallService, OUTBOUND_CALL_SERVICE } from '../services/outbound-call.interface';

@Controller('/api/outbound-call')
export class OutboundCallController {
    constructor(
        @Inject(OUTBOUND_CALL_SERVICE)
        private readonly _outboundCallService : IOutboundCallService,
        @InjectQueue('default')
        private readonly outboundCallJobQueue : Queue
    ) {}

    @Post('clickToCall/:phoneNumberFrom/:phoneNumberTo/:callerId')
    async clickToCall(
        @Param('phoneNumberFrom') phoneNumberFrom: string,
        @Param('phoneNumberTo') phoneNumberTo: string,
        @Param('callerId') callerId: string,
      ): Promise<JsonDataListReturnModel> {
    
        try{

          let result = await this._outboundCallService.clickToCall(
            phoneNumberTo,
            phoneNumberFrom,
            callerId,
          );

          return JsonDataListReturnModel.Ok(result);
        }
        catch(err){
          console.log('ERR -> ', JsonDataListReturnModel.Error(err));
          return JsonDataListReturnModel.Error(err);
        }
    }

    @Get('outboundCallStatusCallBack')
    outboundCallStatusCallBack(@Query() callData: CDRModel):JsonDataListReturnModel {

    this.outboundCallJobQueue.add('outboundCall',callData);

    return JsonDataListReturnModel.Ok('Successfully submitted to job queue');
  }
}
