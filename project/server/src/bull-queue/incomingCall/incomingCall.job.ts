import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { time } from 'console';
import { FsCallDetailRecordEntity } from 'src/entity/call-detail-record';
import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import { CallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.service';
import { CallRecordingService } from 'src/modules/call-recording/services/call-recording.service';
import { TimeProvider } from 'src/utils/timeProvider.utils';
import path from 'path';

@Processor('default')
export class IncomingCallJob {
  constructor(
    private readonly _callDetailRecordService: CallDetailRecordService,
    private readonly _callRecordingService: CallRecordingService
  ) {}

  @Process('inboundCall')
  async handleTranscode(parameter: Job){

    let timeProvider = new TimeProvider();

    let context = new InboundCallJobContext();
    context.dateTime = timeProvider.getDateTimeNow();
    context.unixTimeSeconds = timeProvider.getUnixTimeSeconds();

    console.log('inbound call');

    try
    {

      context.inboundCallParam = parameter.data;

      context.inboundCallParam.StartedDate = context.dateTime;
      
      context.cdrRecord = await this._callDetailRecordService.getByCallUid(parameter.data.UUID);

      let result = await this.saveCallDetailRecord(context);
  
      context.inboundCallParam.Id = result;

      await this.saveCallRecordingStorage(context);

      console.log('Transcoding complete InboundCall'); 
    }
    catch(err){
      console.log('Inbound Call Job ERROR -> ' ,err);
    }
  }

  private async saveCallDetailRecord(context: InboundCallJobContext):Promise<number>{
    if (context.cdrRecord === null || context.cdrRecord === undefined){

      return await this._callDetailRecordService.saveCDR({
          UUID: context.inboundCallParam.UUID,
          PhoneNumberFrom: context.inboundCallParam.PhoneNumberFrom,
          PhoneNumberTo: context.inboundCallParam.PhoneNumberTo,
          CallDirection: context.inboundCallParam.CallDirection,
          StartedDate: context.inboundCallParam.StartedDate,
          CallStatus: context.inboundCallParam.CallStatus,
          Duration: context.inboundCallParam.Duration,
          RecordingUUID: context.inboundCallParam.RecordingUUID,
          ParentCallUid: context.inboundCallParam.ParentCallUid,
          Id:context.inboundCallParam.Id
      });
  }
  else{

      return await this._callDetailRecordService.updateCDR({
          UUID: context.inboundCallParam.UUID,
          PhoneNumberFrom: context.inboundCallParam.PhoneNumberFrom,
          PhoneNumberTo: context.inboundCallParam.PhoneNumberTo,
          CallDirection: context.inboundCallParam.CallDirection,
          StartedDate: context.inboundCallParam.StartedDate,
          CallStatus: context.inboundCallParam.CallStatus,
          Duration: context.inboundCallParam.Duration,
          RecordingUUID: context.inboundCallParam.RecordingUUID,
          ParentCallUid: context.inboundCallParam.ParentCallUid,
          Id: context.inboundCallParam.Id
      });
  }
  }

  
  private async saveCallRecordingStorage(context: InboundCallJobContext){

    let callRecordingStorage = await this._callRecordingService.getByRecordingUUID(context.inboundCallParam.RecordingUUID);

    if (callRecordingStorage === null || callRecordingStorage === undefined){

        let toUnixTimeSeconds = context.unixTimeSeconds;

        let fileName = `${toUnixTimeSeconds}_${context.inboundCallParam.RecordingUUID}.wav`;

        let filePath = path.join(context.inboundCallParam.CallDirection, fileName);

        await this._callRecordingService.saveCallRecording({
            RecordingUUID : context.inboundCallParam.RecordingUUID,
            CallUUID : context.inboundCallParam.UUID,
            FilePath : filePath,
            CallId : context.inboundCallParam.Id,
            DateCreated : context.inboundCallParam.StartedDate
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

class InboundCallJobContext{
  inboundCallParam: CDRModel;
  cdrRecord: FsCallDetailRecordEntity;
  dateTime: string;
  unixTimeSeconds :number;
}
