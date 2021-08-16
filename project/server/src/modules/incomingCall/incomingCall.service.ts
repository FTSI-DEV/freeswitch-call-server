import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeswitchCallSystemEntity } from 'src/entity/freeswitchCallSystem.entity';
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

  incomingStatusCallBack(callData):any{

    console.log('TEST INCOMING STATUS CALLBACK', callData);

    console.log('JSON CONVERT STIRNG', JSON.stringify(callData));

    this._freeswitchCallSystemService.createRecord({
      UUID: callData.UUID,
      CallerIdNumber: callData.CallerIdNumber,
      CallerName: callData.CallerName,
      CallDirection : callData.CallDirection,
      CallStatus: callData.CallStatus,
      CalleeIdNumber: callData.CalleeIdNumber,
      StartedDate: callData.StartedDate,
      StartStamp: callData.StartStamp,
      AnswerStamp: callData.AnswerStamp,
      EndStamp: callData.EndStamp,
      StartEpoch: callData.StartEpoch,
      EndEpoch: callData.EndEpoch,
      Duration: callData.Duration,
      AnswerEpoch: callData.AnswerEpoch
    }, callData.StoreId);

    
  }
}
