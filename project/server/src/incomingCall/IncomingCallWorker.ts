const Queue = require('beequeue');

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
export const processCallEnter = (order) => {
    return incomingCallEnterQueue.createJob(order).save();
};
incomingCallEnterQueue.process((job, done) => {
    console.log(`🧾 ${job.data.StoreId} ${job.data.SystemId}`);
    // Notify the client via push notification, web socket or email etc.
    done();
});

// IncomingCallVerify
export const processCallVerify = (order) => {
    return incomingCallVerifyQueue.createJob(order).save();
};
incomingCallVerifyQueue.process((job, done) => {
    console.log(`🧾 ${job.data.StoreId} ${job.data.SystemId}`);
    // Notify the client via push notification, web socket or email etc.
    done();
});

// WaitingToConnect
export const waitingToConnect = (order) => {
    return waitingToConnectQueue.createJob(order).save();
};
waitingToConnectQueue.process((job, done) => {
    console.log(`🧾 ${job.data.StoreId} ${job.data.SystemId}`);
    // Notify the client via push notification, web socket or email etc.
    done();
});
