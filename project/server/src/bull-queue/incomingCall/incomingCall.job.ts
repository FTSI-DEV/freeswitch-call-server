import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { FsCallDetailRecordEntity } from 'src/entity/call-detail-record';
import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import { TimeProvider } from 'src/utils/timeProvider.utils';
import path from 'path';
import { Inject } from '@nestjs/common';
import { CALL_DETAIL_RECORD_SERVICE, ICallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.interface';
import { CALL_RECORDING_SERVICE, ICallRecordingService } from 'src/modules/call-recording/services/call-recording.interface';
import { CustomAppLogger } from 'src/logger/customLogger';

@Processor('default')
export class IncomingCallJob {

  private readonly _logger = new CustomAppLogger(IncomingCallJob.name);

  constructor(
    @Inject(CALL_DETAIL_RECORD_SERVICE)
    private readonly _callDetailRecordService: ICallDetailRecordService,
    @Inject(CALL_RECORDING_SERVICE)
    private readonly _callRecordingService: ICallRecordingService
  ) {}

  @Process('inboundCall')
  async handleTranscode(parameter: Job){

    let timeProvider = new TimeProvider();

    let context = new InboundCallJobContext();

    context.dateTime = timeProvider.getDateTimeNow();

    context.unixTimeSeconds = timeProvider.getUnixTimeSeconds();

    try
    {

      context.inboundCallParam = parameter.data;

      context.inboundCallParam.StartedDate = context.dateTime;

      this._logger.info(`starting to processed job. CallUid : ${context.inboundCallParam.UUID}`);
      
      context.cdrRecord = await this._callDetailRecordService.getByCallUid(parameter.data.UUID);

      let result = await this.saveCallDetailRecord(context);
  
      context.inboundCallParam.Id = result;

      await this.saveCallRecordingStorage(context);
    }
    catch(err){
      this._logger.error(`Unexpected error. CallUid -> ${context.inboundCallParam.UUID}` , err)
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

      let result =  await this._callDetailRecordService.updateCDR({
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
