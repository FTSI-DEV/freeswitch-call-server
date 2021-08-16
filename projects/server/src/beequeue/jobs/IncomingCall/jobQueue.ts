const BeeQueue = require('bee-queue');

const options = {
    removeOnSuccess: false,
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
}

const jobQueue = new BeeQueue('default', options);

export const incomingPhoneCallJob = (data) => {
    return jobQueue.createJob(data).save();
}

jobQueue.process((job,done) => {
    console.log(`Job -> ${job.data.CallUid}`);
    done();
})
