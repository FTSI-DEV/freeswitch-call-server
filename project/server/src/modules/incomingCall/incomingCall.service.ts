import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CDRModels } from 'src/models/cdr.models';
import { Repository } from 'typeorm';
import { FreeswitchCallSystemService } from '../freeswitch-call-system/services/freeswitch-call-system.service';

@Injectable()
export class IncomingCallService {
  constructor(
    private readonly _freeswitchCallSystemService: FreeswitchCallSystemService
    ) {}

  saveIncomingCallCDR(callData:CDRModels){

    console.log('service CDR VALUE', callData);

    this._freeswitchCallSystemService.saveCDR({
      UUID: callData.UUID,
      CallerIdNumber: callData.CallerIdNumber,
      CallerName: callData.CallerName,
      CallDirection : callData.CallDirection,
      CallStatus: callData.CallStatus,
      CalleeIdNumber: callData.CalleeIdNumber,
      StartedDate: callData.StartedDate,
      RecordingUUID: callData.UUID,
      CallDuration: callData.CallDuration,
    });
  }
}
