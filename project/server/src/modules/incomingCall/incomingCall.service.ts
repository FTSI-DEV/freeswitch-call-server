import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CDRModels } from 'src/models/cdr.models';
import { Repository } from 'typeorm';
import { CallDetailRecordService } from '../call-detail-record/services/call-detail-record.service';

@Injectable()
export class IncomingCallService {
  constructor(
    private readonly _freeswitchCallSystemService: CallDetailRecordService
    ) {}

  saveIncomingCallCDR(callData:CDRModels){

    console.log('service CDR VALUE', callData);

    this._freeswitchCallSystemService.saveCDR({
      UUID: callData.UUID,
      PhoneNumberFrom: callData.PhoneNumberFrom,
      CallDirection : callData.CallDirection,
      CallStatus: callData.CallStatus,
      PhoneNumberTo: callData.PhoneNumberTo,
      StartedDate: callData.StartedDate,
      RecordingUUID: callData.UUID,
      CallDuration: callData.CallDuration,
    });
  }
}
