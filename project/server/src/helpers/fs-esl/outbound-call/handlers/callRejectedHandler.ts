import { CallTypes } from "src/helpers/constants/call-type";
import { OutboundCallContext } from "../models/outboundCallContext";

export class CallRejectedHandler{

    constructor(
        private _context:OutboundCallContext
    ){}

    reject(callback){

        let context = this._context;

        let errMessage = "";

        if (context.errMessage !== undefined ||
            context.errMessage !== null){

            errMessage = context.errMessage.join(',');
        }

        context.Log(`Call rejected -> ${errMessage}`);

        let connection = context.connection;

        connection.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed.wav', () => {

            context.redisServer.del(context.redisServerName, (err,reply) => {
                context.Log(`Delete Redis-Server State. Server Name: ${context.redisServerName} ,
                            Reply: ${reply} , Err: ${err}`);
            });

            connection.execute('hangup', 'CALL_REJECTED', () => {

                context.callRejected = true;

                context.dpInstructions = [];

                callback();
            });
        });
    }
}