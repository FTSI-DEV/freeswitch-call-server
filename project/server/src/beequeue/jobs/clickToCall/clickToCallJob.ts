import { queueDefault } from "src/beequeue/config/beeQueueInstance.config";
import { FreeswitchPhoneNumberConfigService } from "src/modules/config/fs-phonenumber-config/services/phonenumber-config.service";
import { FreeswitchCallSystemService } from "src/modules/freeswitch-call-system/services/freeswitch-call-system.service";

const jobQueue = queueDefault;

export class ClickToCallJob{
    constructor(
        private readonly _freeswitchCallConfigService: FreeswitchPhoneNumberConfigService,
        private readonly _freeswitchCallSystemService: FreeswitchCallSystemService
    ) {}

    trigger(data){
        console.log('TRIGGER CLICK-TO-CALL JOB', data);

        return jobQueue.createJob(data).save();
    }

    private saveRecord(callData){
        this._freeswitchCallSystemService.saveCDR({
            StartedDate: callData.StartedDate,
            UUID: callData.UUID,
            Duration: callData.Duration,
            CallDirection: callData.CallDirection,
            CallStatus: callData.CallStatus,
            CalleeIdNumber: callData.CalleeIdNumber,
            CallerIdNumber: callData.CallerIdNumber,
            CallerName: callData.CallerName,
            RecordingUUID: callData.RecordingUUID
        }, 60);
    }

   private test(){
       jobQueue.process((job,done) => {

        console.log('test here ');

            this.saveRecord(job);
       })
   }
}

