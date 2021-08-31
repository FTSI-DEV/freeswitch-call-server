import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Queue } from 'bull';
import { CDRModels } from 'src/models/cdr.models';
import { FreeswitchPhoneNumberConfigService } from '../config/fs-phonenumber-config/services/phonenumber-config.service';
import { FreeswitchCallSystemService } from '../freeswitch-call-system/services/freeswitch-call-system.service';
import { IFSEslService } from './click-to-call.interface';
import { FsEslService } from './click-to-call.service';
const http = require('http');

@Controller('/api/freeswitch')
export class FreeswitchController {
  constructor(
    @Inject(FsEslService)
    private _freeswitchService: IFSEslService,
    private _freeswitchCallSystemService: FreeswitchCallSystemService,
    private _freeswitchCallConfigService: FreeswitchPhoneNumberConfigService,
    @InjectQueue('default')
    private clickToCallJobQueue: Queue,
  ) {}

  @Post('clickToCall/:phoneNumberFrom/:phoneNumberTo/:callerId')
  async clickToCall(
    @Param('phoneNumberFrom') phoneNumberFrom: string,
    @Param('phoneNumberTo') phoneNumberTo: string,
    @Param('callerId') callerId: string,
  ): Promise<string> {

    let result = await this._freeswitchService.clickToCall(
      phoneNumberTo,
      phoneNumberFrom,
      callerId,
    );

    return result;
  }

  @Get('clickToCallStatusCallBack')
  clickToCallStatusCallBack(@Query() callData: CDRModels) {
    console.log('CLICK TO CALL STATUS CALL BACK API', callData);

    this.clickToCallJobQueue.add('click-to-call', 
    {
      data: callData
    });

    return 'Successfully submitted to job queue';
  }

  @Get('test')
  TestSampleApi() {
    // this.clickToCallJobQueue.add(1);

    this.clickToCallJobQueue.add('job1', {
      data: 1,
    });

    this.clickToCallJobQueue.add('job2', {
      data: 2,
    });

    return 'Successfully submitted to job queue';
  }
}
