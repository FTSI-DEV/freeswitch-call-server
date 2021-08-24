import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ClickToCallJob } from 'src/beequeue/jobs/clickToCall/clickToCallJob';
import { OriginationModel } from 'src/helpers/fs-esl/models/originate.model';
import { CDRModels } from 'src/models/cdr.models';
import { FreeswitchPhoneNumberConfigService } from '../config/fs-phonenumber-config/services/phonenumber-config.service';
import { FreeswitchCallSystemService } from '../freeswitch-call-system/services/freeswitch-call-system.service';
import { FsEslService } from './fs-esl.service';
const http = require('http');

@Controller('/api/freeswitch')
export class FreeswitchController {
  constructor(private _freeswitchService: FsEslService,
              private _freeswitchCallSystemService: FreeswitchCallSystemService,
              private _freeswitchCallConfigService: FreeswitchPhoneNumberConfigService) {}

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

    // http.get()

    return result;
  }

  @Get('clickToCallStatusCallBack')
  clickToCallStatusCallBack(@Query() callData: CDRModels){
    console.log('CLICK TO CALL STATUS CALL BACK', callData);

    // this._freeswitchCallSystemService.saveCDR({
    //   StartedDate: callData.StartedDate,
    //   UUID: callData.UUID,
    //   Duration: callData.Duration,
    //   CallDirection: callData.CallDirection,
    //   CallStatus: callData.CallStatus,
    //   CalleeIdNumber: callData.CalleeIdNumber,
    //   CallerIdNumber: callData.CallerIdNumber,
    //   CallerName: callData.CallerName,
    //   RecordingUUID: callData.RecordingUUID
    // },60)

    new ClickToCallJob(this._freeswitchCallConfigService, this._freeswitchCallSystemService).trigger(callData);

    return "Successfully submitted to job queue";
  }
}
