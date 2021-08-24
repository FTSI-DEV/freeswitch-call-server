import { queueDefault } from "src/beequeue/config/beeQueueInstance.config";
import { FreeswitchPhoneNumberConfigService } from "src/modules/config/fs-phonenumber-config/services/phonenumber-config.service";
import { apiClient } from "src/utils/apiClient";

const jobQueue = queueDefault;

export class IncomingPhoneCallJob{
    constructor(
        private readonly _freeswitchCallConfig: FreeswitchPhoneNumberConfigService

    ) {}

    trigger(data){
        console.log('TRIGGER JOB', data);

        let config = this._freeswitchCallConfig
            .getConfigByPhoneNumber(data.CallerIdNumber);
        
        if (config != null){
            let webhook = config.webhookUrl;

            let httpMethod = config.httpMethod;

            if (httpMethod === "HTTP GET"){
                apiClient.get(webhook);
            }
            else if (httpMethod === "HTTP POST") {
                apiClient.post(webhook);
            }
        }

        return jobQueue.createJob(data).save();
    }
}

// export const incomingPhoneCallJob = (data) => {
//     console.log('INTEREED PHONE CALL JOB', data);
//     return jobQueue.createJob(data).save();
// }

jobQueue.process((job,done) => {
    console.log(`CallUUID -> ${job.data.CallUid}`);

    console.log('JOB PROCESS', job.data);
    return done(job.data);
})
