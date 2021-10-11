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
                channelState : conn.getInfo().getHeader('Channel-State'),
                answerState: conn.getInfo().getHeader('Answer-State')
            };

            context.redisServer.set(context.redisServerName, JSON.stringify(channelStateModel), (err,reply) => {
                context.Log(`Redis state saved: ${reply}`);
            });

            context.redisServer.get(context.redisServerName, (err,reply) => {
            });

            if (channelStateModel.answerState === 'hangup'){
                return;
            }

            let phoneNumberFrom = conn
                .getInfo()
                .getHeader(CHANNEL_VARIABLE.CALLER_CALLE_ID_NUMBER);

            conn.on('error', (err) => {
                context.Log(`ESL Error: ${err}`, true);
            });

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
}