import { Inject, Injectable } from '@nestjs/common';
import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import { CALL_DETAIL_RECORD_SERVICE, ICallDetailRecordService } from '../../call-detail-record/services/call-detail-record.interface';
import { IIncomingCallService } from './incomingCall.interface';

@Injectable()
export class IncomingCallService implements IIncomingCallService{
  constructor(
    @Inject(CALL_DETAIL_RECORD_SERVICE)
    private readonly _callDetailRecordService: ICallDetailRecordService
    ) {}

  async saveIncomingCallCDR(callData:CDRModel){

    await this._callDetailRecordService.saveCDR({
      UUID: callData.UUID,
      PhoneNumberFrom: callData.PhoneNumberFrom,
      CallDirection : callData.CallDirection,
      CallStatus: callData.CallStatus,
      PhoneNumberTo: callData.PhoneNumberTo,
      StartedDate: callData.StartedDate,
      RecordingUUID: callData.UUID,
      Duration: callData.Duration,
    });
  }
}
