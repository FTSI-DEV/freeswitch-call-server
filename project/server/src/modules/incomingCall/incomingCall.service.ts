import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CDRModels } from 'src/models/cdr.models';
import { Repository } from 'typeorm';
import { callEnter, callVerify, waitingToConnect } from '../../beequeue/jobs/IncomingCall';
import { FreeswitchCallSystemService } from '../freeswitch-call-system/services/freeswitch-call-system.service';

@Injectable()
export class IncomingCallService {
  constructor(
    private readonly _freeswitchCallSystemService: FreeswitchCallSystemService
    ) {}

  getIncomingCallEnter(callData): any {
    callEnter(callData).then(res => {
        return {
          done: true,
          success: true
        }
    }).catch(err => {
      return {
        error: err
      }
    })
   return {
          done: true,
          success: true
        }
  }
  getIncomingCallVerify(callData): any {
   return {
      done: true,
      success: true
    }
  }
  getWaitingToConnect(callData): any {
    return {
      done: true,
      success: true
    }
  }

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
