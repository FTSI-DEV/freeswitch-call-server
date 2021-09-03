import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { Queue } from 'bull';
import * as moment from 'moment';
import { CDRModels } from 'src/models/cdr.models';
import { FreeswitchCallSystemService } from 'src/modules/freeswitch-call-system/services/freeswitch-call-system.service';
import { OutboundCallService } from '../services/outbound-call.service';

@Controller('/api/outbound-call')
export class OutboundCallController {
    constructor(
        private readonly _outboundCallService : OutboundCallService,
        private readonly _freeswitchCallSystemService : FreeswitchCallSystemService,
        @InjectQueue('default')
        private readonly outboundCallJobQueue : Queue
    ) {}

    @Post('clickToCall/:phoneNumberFrom/:phoneNumberTo/:callerId')
    async clickToCall(
        @Param('phoneNumberFrom') phoneNumberFrom: string,
        @Param('phoneNumberTo') phoneNumberTo: string,
        @Param('callerId') callerId: string,
      ): Promise<string> {
    
        let result = await this._outboundCallService.clickToCall(
          phoneNumberTo,
          phoneNumberFrom,
          callerId,
        );
    
        this._freeswitchCallSystemService.saveCDR({
          UUID: result,
          CallDirection: 'outbound',
          StartedDate:  moment().format('YYYY-MM-DDTHH:mm:ss.SSS')
        });
    
        return result;
    }

    @Get('outboundCallStatusCallBack')
    outboundCallStatusCallBack(@Query() callData: CDRModels) {

    this.outboundCallJobQueue.add('outboundCall',callData);

    return 'Successfully submitted to job queue';
  }
}
