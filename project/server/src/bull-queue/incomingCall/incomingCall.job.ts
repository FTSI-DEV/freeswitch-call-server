import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FsCallDetailRecordEntity } from 'src/entity/call-detail-record';
import { CallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.service';
import { CallRecordingService } from 'src/modules/call-recording/services/call-recording.service';

@Processor('default')
export class IncomingCallJob {
  constructor(
    private readonly _callDetailRecordService: CallDetailRecordService,
    private readonly _callRecordingService: CallRecordingService
  ) {}

  @Process('inboundCall')
  async handleTranscode(parameter: Job){

    let cdrRecord = await this._callDetailRecordService.getByCallUid(parameter.data.UUID);

    await this.saveCallDetailRecord(cdrRecord, parameter);

    await this.saveCallRecordingStorage(cdrRecord);
    

  console.log('Transcoding complete InboundCall',); 
  
  }

  private async saveCallDetailRecord(cdrRecord: FsCallDetailRecordEntity, parameter: Job){
    if (cdrRecord === null || cdrRecord === undefined){
            
      console.log('Record does not exist', cdrRecord);

      await this._callDetailRecordService.saveCDR({
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

      await this._callDetailRecordService.updateCDR({
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
  }

  
  private async saveCallRecordingStorage(cdrRecord: FsCallDetailRecordEntity){

    let callRecordingStorage = await this._callRecordingService.getByRecordingUUID(cdrRecord.RecordingUid);

    if (callRecordingStorage === null || callRecordingStorage === undefined){
        await this._callRecordingService.saveCallRecording({
            RecordingUUID : cdrRecord.RecordingUid,
            CallUUID : cdrRecord.CallUid,
            FilePath : `${process.env.CALL_RECORDING_BASE_PATH}${cdrRecord.CallUid}`,
        });
    }
    else{
        console.log('CALL RECORDING EXISTS');
    }

}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
