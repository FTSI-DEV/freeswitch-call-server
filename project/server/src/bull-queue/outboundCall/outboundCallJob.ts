import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { FsCallDetailRecordEntity } from "src/entity/call-detail-record";
import { CallDetailRecordService } from "src/modules/call-detail-record/services/call-detail-record.service";
import { CallRecordingService } from "src/modules/call-recording/services/call-recording.service";
import path from 'path';
import { CDRModel } from "src/modules/call-detail-record/models/cdr.models";
import { TimeProvider } from "src/utils/timeProvider.utils";

@Processor('default')
export class OutboundCallJob{

    constructor(
        private readonly _callDetailRecordService: CallDetailRecordService,
        private readonly _callRecordingService: CallRecordingService
    ) {}

    @Process('outboundCall')
    async handleTranscode(parameter: Job){

        let timeProvider = new TimeProvider();

        let context = new OutboundCallJobContext();
        context.dateTime = timeProvider.getDateTimeNow();
        context.unixTimeSeconds = timeProvider.getUnixTimeSeconds();

        console.log('Outbound Call');

        try
        {
            context.outboundCallParam = parameter.data;

            console.log('data -' , parameter.data);
            console.log('context - ', context.outboundCallParam);

            context.outboundCallParam.StartedDate = context.dateTime;

            context.cdrRecord = await this._callDetailRecordService.getByCallUid(context.outboundCallParam.UUID);

            let result = await this.saveCallDetailRecord(context);

            context.outboundCallParam.Id = result;
            
            await this.saveCallRecordingStorage(context);
        }
        catch(err){
            console.log('UNEXECPTED ERROR ', err);
        }
        console.log('Transcoding complete OutboundCall');
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