import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
// import { FsCallDetailRecordEntity } from "src/entity/call-detail-record";
import path from 'path';
import { CDRModel } from "src/modules/call-detail-record/models/cdr.models";
import { TimeProvider } from "src/utils/timeProvider.utils";
import { Inject } from "@nestjs/common";
import { CALL_DETAIL_RECORD_SERVICE, ICallDetailRecordService } from "src/modules/call-detail-record/services/call-detail-record.interface";
import { CALL_RECORDING_SERVICE, ICallRecordingService } from "src/modules/call-recording/services/call-recording.interface";
import { CustomAppLogger } from "src/logger/customLogger";
import { FsCallDetailRecordEntity } from "src/entity/callRecordingStorage.entity";

@Processor('default')
export class OutboundCallJob{

    private readonly _logger = new CustomAppLogger(OutboundCallJob.name);

    constructor(
        @Inject(CALL_DETAIL_RECORD_SERVICE)
        private readonly _callDetailRecordService: ICallDetailRecordService,
        @Inject(CALL_RECORDING_SERVICE)
        private readonly _callRecordingService: ICallRecordingService
    ) {}

    @Process('outboundCall')
    async handleTranscode(parameter: Job){

        let timeProvider = new TimeProvider();

        let context = new OutboundCallJobContext();

        context.dateTime = timeProvider.getDateTimeNow();
        
        context.unixTimeSeconds = timeProvider.getUnixTimeSeconds();

        try
        {
            context.outboundCallParam = parameter.data;

            this._logger.info(`starting to processed job. CallUid : ${context.outboundCallParam.UUID}`);

            context.outboundCallParam.StartedDate = context.dateTime;

            context.cdrRecord = await this._callDetailRecordService.getByCallUid(context.outboundCallParam.UUID);

            let result = await this.saveCallDetailRecord(context);

            context.outboundCallParam.Id = result;
            
            await this.saveCallRecordingStorage(context);
        }
        catch(err){

            this._logger.error(`Unexpected error. CallUid -> ${context.outboundCallParam.UUID}` , err);
        }
    }

    private async saveCallDetailRecord(context:OutboundCallJobContext):Promise<number>{
        if (context.cdrRecord === null || context.cdrRecord === undefined){
            
            return await this._callDetailRecordService.saveCDR({
                UUID: context.outboundCallParam.UUID,
                PhoneNumberFrom: context.outboundCallParam.PhoneNumberFrom,
                PhoneNumberTo: context.outboundCallParam.PhoneNumberTo,
                CallDirection: context.outboundCallParam.CallDirection,
                CallStatus:context.outboundCallParam.CallStatus,
                Duration: context.outboundCallParam.Duration,
                RecordingUUID: context.outboundCallParam.RecordingUUID,
                ParentCallUid: context.outboundCallParam.ParentCallUid,
                Id: context.outboundCallParam.Id,
                StartedDate : context.dateTime
            });
        }
        else{
            return await this._callDetailRecordService.updateCDR({
                UUID: context.outboundCallParam.UUID,
                PhoneNumberFrom: context.outboundCallParam.PhoneNumberFrom,
                PhoneNumberTo: context.outboundCallParam.PhoneNumberTo,
                CallDirection: context.outboundCallParam.CallDirection,
                StartedDate: context.outboundCallParam.StartedDate,
                CallStatus: context.outboundCallParam.CallStatus,
                Duration: context.outboundCallParam.Duration,
                RecordingUUID: context.outboundCallParam.RecordingUUID,
                ParentCallUid: context.outboundCallParam.ParentCallUid,
                Id: context.outboundCallParam.Id
            });
        }

    }

    private async saveCallRecordingStorage(context: OutboundCallJobContext){

        let callRecordingStorage = await this._callRecordingService.getByRecordingUUID(context.outboundCallParam.RecordingUUID);

        if (callRecordingStorage === null || callRecordingStorage === undefined){

            let toUnixTimeSeconds = context.unixTimeSeconds;

            let fileName = `${toUnixTimeSeconds}_${context.outboundCallParam.RecordingUUID}.wav`;

            let filePath = path.join(context.outboundCallParam.CallDirection, fileName);

            await this._callRecordingService.saveCallRecording({
                RecordingUUID : context.outboundCallParam.RecordingUUID,
                CallUUID : context.outboundCallParam.UUID,
                FilePath : filePath,
                CallId : context.outboundCallParam.Id,
                DateCreated : context.outboundCallParam.StartedDate
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

class OutboundCallJobContext{
    outboundCallParam: CDRModel;
    cdrRecord : FsCallDetailRecordEntity;
    dateTime : string;
    unixTimeSeconds: number;
}