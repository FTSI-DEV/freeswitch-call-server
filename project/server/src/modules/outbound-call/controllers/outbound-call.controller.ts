import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Query } from '@nestjs/common';
import { Queue } from 'bull';
import * as moment from 'moment';
import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import { CallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.service';
import { OutboundCallService } from '../services/outbound-call.service';

@Controller('/api/outbound-call')
export class OutboundCallController {
    constructor(
        private readonly _outboundCallService : OutboundCallService,
        @InjectQueue('default')
        private readonly outboundCallJobQueue : Queue
    ) {}

    @Post('clickToCall/:phoneNumberFrom/:phoneNumberTo/:callerId')
    async clickToCall(
        @Param('phoneNumberFrom') phoneNumberFrom: string,
        @Param('phoneNumberTo') phoneNumberTo: string,
        @Param('callerId') callerId: string,
      ): Promise<string> {
    
        try{
          let result = await this._outboundCallService.clickToCall(
            phoneNumberTo,
            phoneNumberFrom,
            callerId,
          );

          return result;
        }
        catch(err){
         return err;
        }
    }

    @Get('outboundCallStatusCallBack')
    outboundCallStatusCallBack(@Query() callData: CDRModel) {

    this.outboundCallJobQueue.add('outboundCall',callData);

    return 'Successfully submitted to job queue';
  }
}
