import { retry } from "rxjs";
import { CHANNEL_VARIABLE } from "src/helpers/constants/channel-variables.constants";
import { CustomAppLogger } from "src/logger/customLogger";
import { CallTypeEnum } from "src/modules/inbound-rules-config/enums/call-type.enum";
import { InboundRulesConfigModel } from "src/modules/inbound-rules-config/models/inbound-rules.model";
import { InboundEslConnResult } from "../inbound-esl.connection";
import { ChannelStateModel } from "../models/channelState.model";
import { InboundCallDialplanHelper } from "./handlers/inbound-call-dialplan";
import { IvrCallHelper } from "./ivr-call";
import { InboundCallContext } from "./models/inbound-call-context.model";

export class InboundCallHelper{
    
    private readonly _logger = new CustomAppLogger(InboundCallHelper.name);

    private readonly _inboundEslConn = InboundEslConnResult;

    constructor(
        readonly _context: InboundCallContext,
        
    ){}

    inboundCallEnter(){

        let context = this._context;

        let server = this._context.eslServer;

        context.logger = this._logger;

        server.on('connection::ready', async (conn) => {

            context.Log('Inbound call server ready. ');

            context.connection = conn;

            context.inboundEslConnResult = this._inboundEslConn;

            context.legId = this.getChannelVariable(CHANNEL_VARIABLE.UNIQUE_ID, context);

            let channelStateModel : ChannelStateModel = {
                legId: context.legId,
                channelState : this.getChannelVariable('Channel-State',context),
                answerState : this.getChannelVariable('Answer-State', context)
            };

            context.inboundChannelStateKey = `InboundChannelStateKey:${context.legId}`;

            if (channelStateModel.answerState === 'hangup'){
                return;
            }

            let phoneNumberFrom = this.getChannelVariable(CHANNEL_VARIABLE.CALLER_CALLER_ID_NUMBER,context);

            let callerDestinationNumber = this.getChannelVariable(CHANNEL_VARIABLE.CALLER_DESTINATION_NUMBER, context);

            this._onListenEvent(context);

            context.serviceModel.inboundRulesConfigService
                .getByCallerId(callerDestinationNumber)
                .then((config) => {

                    context.inboundRequestParam.From = phoneNumberFrom;

                    context.inboundRequestParam.To = config.callerId;

                    context.webhookParam = {
                        httpMethod: config.httpMethod,
                        actionUrl: config.webhookUrl
                    };

                    this.getCallType(config, channelStateModel);

                    context.redisServer.set(`${context.inboundChannelStateKey}`, JSON.stringify(channelStateModel), (err,reply) => {
                        context.Log(`Redis state set: 
                            Key: ${context.inboundChannelStateKey} ,
                            Reply: ${reply} , 
                            Error: ${err}`);
                    });

                    if (config.callTypeId === CallTypeEnum.IVR){
                        new IvrCallHelper(this._context);
                    }
                    else if (config.callTypeId === CallTypeEnum.Inbound){
                      
                        new InboundCallDialplanHelper(this._context)
                            .processedInstruction(() => {
                            
                            console.log('Finished processing instructions.');
                        });
                    }
                    
                })
                .catch((error) => {
                    context.Log(`Error while retrieving records to the database.
                        Message => ${error} `, true);
                    
                    this._context.serviceModel.callRejectedHandler.reject(this._context, () => {});
               
                    return;
                });
        });
    }

    private getCallType(config:InboundRulesConfigModel, channelStateModel:ChannelStateModel){

        if (config.callTypeId === CallTypeEnum.IVR){

            channelStateModel.callType = CallTypeEnum.IVR.toString();
        }
        else if (config.callTypeId === CallTypeEnum.Inbound){
            
            channelStateModel.callType = CallTypeEnum.Inbound.toString();
        }
    }

    private getChannelVariable(headerName:string, context:InboundCallContext){

        let connection = context.connection;

        return connection.getInfo().getHeader(headerName);
    }

    private _onListenEvent(context:InboundCallContext){

        let connection = context.connection;

        connection.on('error', (err) => {
            context.Log(`Inbound Call Error. Message : ${err}` , true);
        });

        let hangupCompleteEvent = 'esl::event::CHANNEL_HANGUP_COMPLETE::' + context.legId;

        let hangupCompleteWrapper = (evt) => {

            context.legStop = true;

            context.Log('Leg-A hangup');

            let hangupCause = evt.getHeader(CHANNEL_VARIABLE.HANGUP_CAUSE);

            context.Log(`Hangup Cause => ${hangupCause} `);

            connection.removeListener(hangupCompleteEvent, hangupCompleteWrapper);

            context.redisServer.del(context.inboundChannelStateKey, (err,reply) => {
                context.Log(`Delete Redis-Server State. 
                StateKey: ${context.inboundChannelStateKey} ,
                Reply: ${reply} , 
                Err: ${err}`);
            });
        };

        connection.subscribe('CHANNEL_HANGUP_COMPLETE');

        connection.on(hangupCompleteEvent, hangupCompleteWrapper);
    }
}