import { Injectable } from '@nestjs/common';
import { callEnter, callVerify, waitingToConnect } from '../../jobs/IncomingCall';

@Injectable()
export class IncomingCallService {
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
}
