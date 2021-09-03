import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { FreeswitchCallSystemService } from "src/modules/freeswitch-call-system/services/freeswitch-call-system.service";

@Processor('default')
export class OutboundCallJob{

    constructor(
        private readonly _freeswitchCallSystemService: FreeswitchCallSystemService
    ) {}

    @Process('outboundCall')
    async handleTranscode(parameter: Job){

        let cdrRecord = await this._freeswitchCallSystemService.getByCallUid(parameter.data.UUID);

        if (cdrRecord === null || cdrRecord === undefined){
            
            console.log('Record does not exist', cdrRecord);

            await this._freeswitchCallSystemService.saveCDR({
                UUID: parameter.data.UUID,
                CallerIdNumber: parameter.data.CallerIdNumber,
                CalleeIdNumber: parameter.data.CalleeIdNumber,
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
                CallerIdNumber: parameter.data.CallerIdNumber,
                CalleeIdNumber: parameter.data.CalleeIdNumber,
                CallDirection: parameter.data.CallDirection,
                StartedDate: parameter.data.StartedDate,
                CallStatus: parameter.data.CallStatus,
                CallDuration: parameter.data.Duration,
                RecordingUUID: parameter.data.RecordingUUID,
                ParentCallUid: parameter.data.ParentCallUid,
                Id: parameter.data.Id
            });
        }

        console.log('Transcoding complete OutboundCall');
    }

    @OnQueueActive()
    onActive(job: Job) {
        console.log(
        `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}