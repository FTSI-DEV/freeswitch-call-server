const Queue = require('beequeue');
const http = require('http');

//const baseUrl = 'http://www.google.com/search?q=';

import { 
    WebhookGetIncomingCallEnterUri, 
    WebhookGetIncomingCallVerify, 
    WebhookGetWaitingToConnect 
} from '../utils/webhooks';

export class CreateQueue {

    private queue: any

    constructor(name) {
        // Instantiate a new queue
        this.queue = new Queue(name);
    }

    createJob(CallerId, Caller, Calle) {

        // Create Job
        const job = this.queue.createJob({ CallerId, Caller, Calle })
            .save((err, job) => {
                console.log('err: ', err);
                console.log('jobId: ', job.id);
            });

        // The job has succeeded. If result is defined, the handler called done(null, result).
        job.on("succeeded", (result) => {
            console.log('result: ', result);
            console.log('Received result for job ' + job.id + ': ' + result);
        });

        // The job has succeeded. If result is defined, the handler called done(null, result).
        job.on('retrying', function (err) {
            console.log('Job ' + job.id + ' failed with error ' + err.message + 'but is being retried!');
        });

        // The job has sent a progress report of progress percent
        job.on('progress', function (progress) {
            console.log('progress: ', progress);
            console.log('Job ' + job.id + ' reported progress: ' + progress + '%');
        });


        // To start processing jobs, call Queue.process and provide a handler function
        this.queue.process((job, done) => {

            // Reports job progress when called within a handler function. Causes a progress event to be emitted.
            job.reportProgress(100);

            //  http.get(baseUrl + 'pet' + '-' + 'cat', function (res) {
            //      console.log('res http.get: ', res.req.socket._host);
            //     return done(null, res.req.socket._host);
            // });

            console.log('JOB DATA: ', job.data);
            http.get(WebhookGetIncomingCallEnterUri(1, 2), function (res) {
                
                return done(null, `StatusCode: ${res.statusCode}; StatusMessage: ${res.statusMessage}; `);
            });

            //  http.get(WebhookGetIncomingCallVerify(1, 2), function (res) {
            //     return done(null, `StatusCode: ${res.statusCode}; StatusMessage: ${res.statusMessage}; `);
            // });

            //  http.get(WebhookGetWaitingToConnect(1, 2), function (res) {
            //     return done(null, `StatusCode: ${res.statusCode}; StatusMessage: ${res.statusMessage}; `);
            // });

           // return done(null, `${job.data.CallerId} ${job.data.Caller} ${job.data.Calle}`);
        });
    }
}