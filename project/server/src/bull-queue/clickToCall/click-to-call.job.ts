import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { CDRModels } from "src/models/cdr.models";
import { FreeswitchCallSystemService } from "src/modules/freeswitch-call-system/services/freeswitch-call-system.service";

@Processor('default')
export class ClickToCallJob{

    constructor(
        private readonly _freeswitchCallSystemService: FreeswitchCallSystemService
    ) {}

    @Process('click-to-call')
    async handleTranscode(parameter: Job){
        console.log('Start transcoding...' , parameter.data);
        // console.log('PARAMETER', parameter);

        // console.log('callerId ->' ,parameter.data.data.CallerIdNumber);

        await this._freeswitchCallSystemService.updateCDR({
            UUID: parameter.data.UUID,
            CallerIdNumber: parameter.data.CallerIdNumber,
            CalleeIdNumber: parameter.data.CalleeIdNumber,
            CallDirection: parameter.data.CallDirection,
            StartedDate: parameter.data.StartedDate,
            CallStatus: parameter.data.CallStatus,
            CallDuration: parameter.data.Duration,
            RecordingUUID: parameter.data.RecordingUUID,
            Id: parameter.data.Id
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