const Queue = require('bee-queue');

const options = {
    removeOnSuccess: true,
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
}

const incomingCallEnterQueue = new Queue('incomingCallEnter', options);
const incomingCallVerifyQueue = new Queue('incomingCallVerify', options);
const waitingToConnectQueue = new Queue('waitingToConnect', options);

// IncomingCallEnter
export const callEnter = (data) => {
    return incomingCallEnterQueue.createJob(data).save();
};

incomingCallEnterQueue.process((job, done) => {
    setTimeout(() => {
        console.log(`🧾 ${job.data.StoreId} ${job.data.SystemId}`);
    }, 5000)
    setTimeout(() => {
        console.log(`🧾 ${job.data.StoreId} ${job.data.SystemId}`);
        done();
    }, 10000)
});

// IncomingCallVerify
export const callVerify = (data) => {
    return incomingCallVerifyQueue.createJob(data).save();
};
incomingCallVerifyQueue.process((job, done) => {
    console.log(`🧾 ${job.data.StoreId} ${job.data.SystemId}`);
    // Notify the client via push notification, web socket or email etc.
    done();
});

// WaitingToConnect
export const waitingToConnect = (data) => {
    return waitingToConnectQueue.createJob(data).save();
};
waitingToConnectQueue.process((job, done) => {
    console.log(`🧾 ${job.data.StoreId} ${job.data.SystemId}`);
    // Notify the client via push notification, web socket or email etc.
    done();
});
