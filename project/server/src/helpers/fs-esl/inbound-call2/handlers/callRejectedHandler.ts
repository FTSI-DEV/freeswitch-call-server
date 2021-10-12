import { InboundCallContext } from "../models/inboundCallContext";

export class CallRejectedHandler{
 
    constructor(
    ){}

    reject(context:InboundCallContext, callback){

        let errMessage = "";

        if (context.errorMessage !== undefined ||
            context.errorMessage !== null){

            errMessage = context.errorMessage.join(',');

        }

        context.Log(`Call rejected -> ${errMessage} `);

        let connection = context.connection;

        connection.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed.wav', () => {

            context.redisServer.del(context.inboundChannelStateKey, (err,reply) => {
                context.Log(`Delete Redis-Server State. 
                StateKey: ${context.inboundChannelStateKey} ,
                Reply: ${reply} , 
                Err: ${err}`);
            });

            connection.execute('hangup', 'CALL_REJECTED', () => {

                context.callRejected = true;

                context.dialplanInstructions = [];

                callback();
            });
        });
    }

}