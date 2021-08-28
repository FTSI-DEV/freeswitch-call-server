import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CDRModels } from "src/models/cdr.models";
import { FreeswitchCallSystemService } from "src/modules/freeswitch-call-system/services/freeswitch-call-system.service";

@Processor('default')
export class ClickToCallJob{

    constructor(
        private readonly _freeswitchCallSystemService: FreeswitchCallSystemService
    ) {}

    @Process()
    handleTranscode(parameter: Job){
        console.log('Start transcoding...');
        console.log('PARAMETER', parameter);

        this._freeswitchCallSystemService.saveCDR({
            UUID: parameter.data.UUID,
            CallerIdNumber: parameter.data.CallerIdNumber,
            CallerName: parameter.data.CallerIdNumber,
            CalleeIdNumber: parameter.data.CalleeIdNumber,
            CallDirection: parameter.data.CallDirection,
            StartedDate: parameter.data.StartedDate,
            CallStatus: parameter.data.CallStatus,
            CallDuration: parameter.data.Duration,
            RecordingUUID: parameter.data.RecordingUUID
        });

        console.log('result', parameter.data);

        console.log('Transcoding complete');
    }

    @OnQueueActive()
    onActive(job: Job) {
        console.log(
        `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}