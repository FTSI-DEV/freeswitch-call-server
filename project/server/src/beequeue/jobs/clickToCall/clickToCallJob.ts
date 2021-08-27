import { IBeeQueueJob } from "src/beequeue/beeQueueJob.interface";
import { redisOptions } from "src/beequeue/config/redisOptions.config";
import { CustomLogger } from "src/logger/logger";
import { FreeswitchCallSystemService } from "src/modules/freeswitch-call-system/services/freeswitch-call-system.service";

const BeeQueue = require('bee-queue');

const jobQueue = new BeeQueue('default', redisOptions);

export class ClickToCallJob implements IBeeQueueJob<any>{

    private readonly _consoleLogger = new CustomLogger(ClickToCallJob.name);
    private readonly _logger

    constructor(
        private readonly _freeswitchCallSystemService: FreeswitchCallSystemService,
    ){}

    trigger(parameter: any) {

        
        jobQueue.process((job, done) => {

            this._consoleLogger.log('JobId: ', job.id);

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