import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.service';
import { IncomingCallService } from 'src/modules/incomingCall/incomingCall.service';

@Processor('default')
export class IncomingCallJob {
  constructor(private readonly _freeswitchCallSystemService: CallDetailRecordService) {}

  @Process('inboundCall')
  async handleTranscode(parameter: Job){

    let cdrRecord = await this._freeswitchCallSystemService.getByCallUid(parameter.data.UUID);

    if (cdrRecord === null || cdrRecord === undefined){
            
      console.log('Record does not exist', cdrRecord);

      await this._freeswitchCallSystemService.saveCDR({
          UUID: parameter.data.UUID,
          PhoneNumberFrom: parameter.data.PhoneNumberFrom,
          PhoneNumberTo: parameter.data.PhoneNumberTo,
          CallDirection: parameter.data.CallDirection,
          StartedDate: parameter.data.StartedDate,
          CallStatus: parameter.data.CallStatus,
          CallDuration: parameter.data.Duration,
          RecordingUUID: parameter.data.RecordingUUID,
          ParentCallUid: parameter.data.ParentCallUid,
          Id: parameter.data.Id
      });
  }
  else{
      console.log('Record exists');

      console.log('UUID -> ', parameter.data.UUID);

      await this._freeswitchCallSystemService.updateCDR({
          UUID: parameter.data.UUID,
          PhoneNumberFrom: parameter.data.PhoneNumberFrom,
          PhoneNumberTo: parameter.data.PhoneNumberTo,
          CallDirection: parameter.data.CallDirection,
          StartedDate: parameter.data.StartedDate,
          CallStatus: parameter.data.CallStatus,
          CallDuration: parameter.data.Duration,
          RecordingUUID: parameter.data.RecordingUUID,
          ParentCallUid: parameter.data.ParentCallUid,
          Id: parameter.data.Id
      });
  }
    

  console.log('Transcoding complete InboundCall',); 
  
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
