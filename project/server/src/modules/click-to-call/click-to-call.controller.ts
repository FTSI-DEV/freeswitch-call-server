import { Controller, Get, Inject, Logger, Param, Post, Query } from '@nestjs/common';

import { IBeeQueueJob } from 'src/beequeue/beeQueueJob.interface';
import { redisOptions } from 'src/beequeue/config/redisOptions.config';
import { ClickToCallJob } from 'src/beequeue/jobs/clickToCall/clickToCallJob';
import { OriginationModel } from 'src/helpers/fs-esl/models/originate.model';
import { CustomLogger } from 'src/logger/logger';
import { CDRModels } from 'src/models/cdr.models';
import { FreeswitchPhoneNumberConfigService } from '../config/fs-phonenumber-config/services/phonenumber-config.service';
import { FreeswitchCallSystemService } from '../freeswitch-call-system/services/freeswitch-call-system.service';
import { GREETING_SERVICE, IFSEslService } from './click-to-call.interface';
import { FsEslService } from './click-to-call.service';
const http = require('http');

const BeeQueue = require('bee-queue');
const jobQueue = new BeeQueue('default', redisOptions);

@Controller('/api/freeswitch')
export class FreeswitchController {

  constructor(  
              @Inject(FsEslService)
              private _freeswitchService: IFSEslService,
              private _freeswitchCallSystemService: FreeswitchCallSystemService,
              private _freeswitchCallConfigService: FreeswitchPhoneNumberConfigService
              ) {}

  @Post('clickToCall/:phoneNumberFrom/:phoneNumberTo/:callerId')
  clickToCall(
    @Param('phoneNumberFrom') phoneNumberFrom: string,
    @Param('phoneNumberTo') phoneNumberTo: string,
    @Param('callerId') callerId: string,
  ): string {
    console.log(`CTC PARAM - ${phoneNumberFrom}, 
                    phoneNumberTo - ${phoneNumberTo} , 
                    callerId - ${callerId}`);

    let result = this._freeswitchService.clickToCall(
      phoneNumberTo,
      phoneNumberFrom,
      callerId,
    );

    return result;
  }

  @Get('clickToCallStatusCallBack')
  clickToCallStatusCallBack(@Query() callData: CDRModels){
    console.log('CLICK TO CALL STATUS CALL BACK API', callData);

    jobQueue.createJob(callData).save();

    new ClickToCallJob(this._freeswitchCallSystemService).trigger(callData);

    return "Successfully submitted to job queue";
  }
}