import { IBeeQueueJob } from "src/beequeue/beeQueueJob.interface";
import { redisOptions } from "src/beequeue/config/redisOptions.config";
import { FreeswitchCallSystemService } from "src/modules/freeswitch-call-system/services/freeswitch-call-system.service";

const BeeQueue = require('bee-queue');

const jobQueue = new BeeQueue('default', redisOptions);

export class IncomingCallJob implements IBeeQueueJob<any>{

    constructor(
        private readonly _freeswitchCallSystemService: FreeswitchCallSystemService
    ) {}

    trigger(parameter: any) {
        console.log('Parameter', parameter);

        jobQueue.process((job,done) => {
            console.log('jobId',job.id);

            this._freeswitchCallSystemService.saveCDR({
                UUID: parameter.UUID,
                CallerIdNumber: parameter.CallerIdNumber,
                CallerName: parameter.CallerIdNumber,
                CalleeIdNumber: parameter.CalleeIdNumber,
                CallDirection: parameter.CallDirection,
                StartedDate: parameter.StartedDate,
                CallStatus: parameter.CallStatus,
                CallDuration: parameter.Duration,
                RecordingUUID: parameter.RecordingUUID
            });

            console.log('result', job.data);
            done(null, job.id);
        });

        jobQueue.on('succeeded', (job,result) => {
            console.log('success');
        })
    }
}

