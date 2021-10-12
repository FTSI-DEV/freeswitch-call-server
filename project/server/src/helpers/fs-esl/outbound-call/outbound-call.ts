import { CHANNEL_VARIABLE } from "src/helpers/constants/channel-variables.constants";
import { CustomAppLogger } from "src/logger/customLogger";
import { InboundEslConnResult } from "../inbound-esl.connection";
import { OutboundCallContext } from "./models/outboundCallContext";
import { DialVerify } from "./handlers/dialVerify";
import { CallRejectedHandler } from "./handlers/callRejectedHandler";
import { ChannelStateModel } from "../models/channelState.model";

export class OutboundCallHelper{

    private readonly _logger = new CustomAppLogger(OutboundCallHelper.name);
    
    private readonly _inboundEslConn = InboundEslConnResult;

    constructor(
        private _context: OutboundCallContext,
        private _callRejectedHandler = new CallRejectedHandler(_context)
    ){}

    outboundCallEnter(){

        let server = this._context.server;

        let context = this._context;

        server.on('connection::ready', (conn) => {

            context.Log(`OutboundCall server ready`);

            context.connection = conn;
            
            let legId = conn
                .getInfo()
                .getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

            let channelStateModel: ChannelStateModel = {
                legId : legId,
                channelState : this.getChannelVariable('Channel-State'),
                answerState: this.getChannelVariable('Answer-State')
            };

            context.outboundChannelStateKey = `OutboundChannelStateKey:${legId}`;

            context.redisServer.set(context.outboundChannelStateKey, JSON.stringify(channelStateModel), (err,reply) => {
                context.Log(`Redis state set: 
                Key: ${context.outboundChannelStateKey} ,
                Reply: ${reply} , 
                Error: ${err}`);
            });

            context.redisServer.get(context.outboundChannelStateKey, (err,reply) => {
            });

            if (channelStateModel.answerState === 'hangup'){
                return;
            }

            let phoneNumberFrom = conn
                .getInfo()
                .getHeader(CHANNEL_VARIABLE.CALLER_CALLE_ID_NUMBER);

            this._onListenEvent();

            context.outboundRequestParam.From = phoneNumberFrom;

            context.serviceModel.callDetailRecordSrvc
                .getByCallUid(legId)
                .then((result) => {

                if (result === undefined){
                    this._context.legStop = true;
                    this._context.callRejected = true;
                    this._callRejectedHandler.reject(() => {});
                    return;
                }

                new DialVerify(this._context).dialVerify();

            })
            .catch((error) => {
                this._context.legStop = true;
                this._context.callRejected = true;
                this._callRejectedHandler.reject(() => {});
                return;

            });
        });
    }

    private getChannelVariable(headerName:string){

        return this._context.connection.getInfo().getHeader(headerName);
    }

    private _onListenEvent(){

        let connection = this._context.connection;

        connection.on('error', (err) => {
            this._context.Log(`Outbound Call Error. Message : ${err}` , true);
        });

        let hangupCompleteEvent = 'esl::event::CHANNEL_HANGUP_COMPLETE::' + this._context.legId;

        let hangupCompleteWrapper = (evt) => {

            this._context.legStop = true;

            this._context.Log('Leg-A hangup');

            let hangupCause = evt.getHeader(CHANNEL_VARIABLE.HANGUP_CAUSE);

            this._context.Log(`Hangup Cause => ${hangupCause} `);

            connection.removeListener(hangupCompleteEvent, hangupCompleteWrapper);

            this._context.redisServer.del(this._context.outboundChannelStateKey, (err,reply) => {
                this._context.Log(`Delete Redis-Server State. 
                StateKey: ${this._context.outboundChannelStateKey} ,
                Reply: ${reply} , 
                Err: ${err}`);
            });
        };

        connection.subscribe('CHANNEL_HANGUP_COMPLETE');

        connection.on(hangupCompleteEvent, hangupCompleteWrapper);

    }
}