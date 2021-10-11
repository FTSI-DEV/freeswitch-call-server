import { OutboundCallContext } from "../models/outboundCallContext";

export class CallRejectedHandler{

    constructor(
        private _context:OutboundCallContext
    ){}

    reject(context:OutboundCallContext, callback){
        let connection = context.connection;

        connection.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed.wav', () => {

            this._context.redisServer.del(this._context.redisServerName, (err,reply) => {
                console.log('Delete Redis-Server State -> ', reply);
                console.log('Redis Server Name :  ', this._context.redisServerName);
            });

            connection.execute('hangup', 'CALL_REJECTED', () => {
                context.callRejected = true;
                context.dpInstructions = [];
                callback();
            });
        });
    }
}