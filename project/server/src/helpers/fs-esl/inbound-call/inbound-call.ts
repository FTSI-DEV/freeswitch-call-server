import { CustomAppLogger } from "src/logger/customLogger";
import { IInboundCallConfigService } from "src/modules/inbound-call-config/services/inbound-call-config.interface";
import { CHANNEL_VARIABLE } from "../../constants/channel-variables.constants";
import { InboundEslConnResult } from "../inbound-esl.connection";
import { InboundCallDialplan } from "./inbound-call-instructions";
import { inboundCallServer } from "./inboundCall.server";
import { InboundCallContext } from "./models/inboundCallContext";

export class InboundCallHelper{

    private readonly _logger = new CustomAppLogger(InboundCallHelper.name);
    private readonly _inboundEslConn = InboundEslConnResult;

    constructor(
        private _context: InboundCallContext,
        private readonly _inboundCallDialplan = new InboundCallDialplan(_context)
    ){}

    inboundCallEnter(){

        let context = this._context;

        let server = this._context.server;

        server.on('connection::ready', async (conn) => {

            context.Log(`InboundCall server ready`);

            context.connection = conn;

            context.logger = this._logger;

            context.inboundESLConnResult = this._inboundEslConn;

            context.legId = this.getChannelVariable(CHANNEL_VARIABLE.UNIQUE_ID, context);

            let phoneNumberFrom = this.getChannelVariable(CHANNEL_VARIABLE.CALLER_CALLER_ID_NUMBER,context);

            let callerDestinationNumber = this.getChannelVariable(CHANNEL_VARIABLE.CALLER_DESTINATION_NUMBER, context);

            this._onListenEvent(context);

            //Play welcome message
            conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/WelcomeMessage.mp3', () => {

                context.serviceModel.inboundCallConfigSrvc
                .getByCallerId(callerDestinationNumber)
                .then((config) => {

                    context.requestParam.From = phoneNumberFrom;

                    context.requestParam.To = config.callerId;

                    context.webhookParam = {
                        httpMethod : config.httpMethod,
                        actionUrl : config.webhookUrl
                    };

                    this._inboundCallDialplan.getInstruction(context, async (result) => {

                        if (result.callRejected){
                            context.serviceModel.callRejectedHandler.reject(context, () => {});
                            return;
                        }

                        this._inboundCallDialplan.setInstruction(context.twiMLResponse, context);

                        if (context.callRejected){

                            context.serviceModel.callRejectedHandler.reject(context, () => {});
                            return;
                        }

                        if (context.instructionValidated){

                            if (context.isLastDialplan){
                                this._inboundCallDialplan.executeLastDialplanInstruction(context, () => {

                                    console.log('LAST DP1 ');

                                    this._inboundEslConn.callModel = context.inboundESLConnResult.callModel;

                                    if (context.callRejected){
                                        this._inboundCallDialplan.callRejectedHandler(context, () => {
                                            context.Log('Call has rejected');
                                        });
                                    }

                                    this._logger.info('All instructions are executed');
                                });
                            }
                            else
                            {
                               this._inboundCallDialplan.executeNextInstruction(() => {
                                    console.log('LAST DP2 ');
                                    this._inboundEslConn.callModel = context.inboundESLConnResult.callModel;
                                   this._logger.info('All instructions are executed');
                               });
                            }
                        }
                    });
                })
                .catch((err) => {
                    context.Log(`Error while retrieving records to database. Message => ${err}` , true);
                    this._inboundCallDialplan.callRejectedHandler(context, () => {
                    });
                });
            });
        });
    }

    private _onListenEvent(context:InboundCallContext){

        let connection = context.connection;

        connection.on('error', (err) => {
            context.Log(`Inbound Call Error. Message : ${err}` , true);
        });

        // connection.sendRecv('linger');

        let hangupCompleteEvent = 'esl::event::CHANNEL_HANGUP_COMPLETE::' + context.legId;

        let hangupCompleteWrapper = (evt) => {

            context.legStop = true;

            context.Log('Leg-A hangup');

            let hangupCause = evt.getHeader(CHANNEL_VARIABLE.HANGUP_CAUSE);

            context.Log(`Hnagup Cause => ${hangupCause}`);

            context.Log(`Webparam Cause => ${JSON.stringify(context.webhookParam)}`);

            // if (!context.callRejected){
            //     context.Log(`ActionUrl -> ${context.webhookParam.actionUrl} , ${context.webhookParam.httpMethod}`);
            //     this._inboundCallDialplan.triggerWebhookUrl(context.webhookParam.actionUrl,
            //         context.webhookParam.httpMethod,
            //         context.voiceRequestParam, () => {
            //             context.Log('Triggered webhook end call.');
            //     });
            // }

            connection.removeListener(hangupCompleteEvent, hangupCompleteWrapper);
        };

        connection.subscribe('CHANNEL_HANGUP_COMPLETE');

        connection.on(hangupCompleteEvent, hangupCompleteWrapper);
    }

    private getChannelVariable(headerName:string,context:InboundCallContext){

        let connection = context.connection;

        return connection.getInfo().getHeader(headerName);
    }
}

const RecordEnum = {
    DoNotRecord: 'do-not-record',
    RecordFromAnswer: 'record-from-answer',
    RecordFromRinging: 'record-from-ringing',
    RecordFromAnswerDual: 'record-from-answer-dual',
    RecordFromRingingDual: 'record-from-ringing-dual',
};
