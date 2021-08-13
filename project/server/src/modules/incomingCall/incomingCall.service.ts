import { Injectable } from '@nestjs/common';

@Injectable()
export class IncomingCallService {
  getIncomingCallEnter(): string {
    return 'getIncomingCallEnter';
  }
  getIncomingCallVerify(): string {
    return 'getIncomingCallEnter';
  }
  getWaitingToConnect(): string {
    return 'getIncomingCallEnter';
  }
}
