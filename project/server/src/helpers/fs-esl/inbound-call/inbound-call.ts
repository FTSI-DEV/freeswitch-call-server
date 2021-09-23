import { IInboundCallConfigService } from "src/modules/inbound-call-config/services/inbound-call-config.interface";
import { CHANNEL_VARIABLE } from "../../constants/channel-variables.constants";
import { InboundCallDialplan } from "./inbound-call-instructions";
import { inboundCallServer } from "./inboundCall.server";
import { InboundCallContext } from "./models/inboundCallContext";

export class InboundCallHelper{

    constructor(
        private readonly _inboundCallConfigService: IInboundCallConfigService,
        private readonly _inboundCallDialplan = new InboundCallDialplan()
    ){}

    inboundCallEnter(){

        inboundCallServer.on('connection::ready', async (conn) => {

            console.log('Inbound Call - server ready');

            let context = new InboundCallContext();

            context.conn = conn;

            context.legId = this.getChannelVariable(CHANNEL_VARIABLE.UNIQUE_ID, context);
            
            let phoneNumberFrom = this.getChannelVariable(CHANNEL_VARIABLE.CALLER_CALLER_ID_NUMBER,context);

            let callerDestinationNumber = this.getChannelVariable(CHANNEL_VARIABLE.CALLER_DESTINATION_NUMBER, context);

            console.log('Leg-A' , context.legId );

            this._onListenEvent(context);

            //Play welcome message
            conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/WelcomeMessage.mp3', () => {
                console.log('Playback executed');

                console.log('callerdest', callerDestinationNumber);
                this._inboundCallConfigService
                .getByCallerId(callerDestinationNumber)
                .then((config) => {

                    console.log('callerid', config.callerId);

                    context.voiceRequestParam.From = phoneNumberFrom;
                    context.voiceRequestParam.To = config.callerId;
                    context.voiceRequestParam.StoreId = 60;
                    context.voiceRequestParam.SystemId = 0;

                    context.webhookParam = {
                        httpMethod : config.httpMethod,
                        actionUrl : config.webhookUrl
                    };

                    this._inboundCallDialplan.getInstruction(context, async (result) => {

                        if (result.hasError){
                            console.log('Error. Cannot continue to process the further instructions.');
                            console.log('error message -> ' , result.errorMessage);
                            return;
                        }

                        console.log('TwiML Response -> ', result.twiMLResponse);

                        this._inboundCallDialplan.setInstruction(context.twiMLResponse, context);

                        if (context.callRejected){
                            context.legStop = true;
                            this._inboundCallDialplan.callRejectedHandler(context, () => {
                                console.log('Call rejected!');
                                return;
                            });
                        }

                        if (context.instructionValidated){

                            if (context.isLastDialplan){
                                this._inboundCallDialplan.executeLastDialplanInstruction(context, () => {
                                    console.log('validated bridge');
                                });
                            }
                            else
                            {
                               this._inboundCallDialplan.executeNextInstruction(context, () => {
                                    console.log('All instructions are executed');
                               });
                            }
                        }
                    });
                })
                .catch((err) => {
                    console.log('Error while retrieving records to database.', err);
                    this._inboundCallDialplan.callRejectedHandler(context, () => {
                        console.log('Error handled!');
                    });
                });
            });
        });
    }

    private _onListenEvent(context:InboundCallContext){
        
        let connection = context.conn;

        connection.on('error', (err) => {
            console.log('Inbound Call Error -> ', err);
        });

        connection.sendRecv('linger', (cb) => {
            console.log('cbbb -> ' , cb);
        });

        let hangupCompleteEvent = 'esl::event::CHANNEL_HANGUP_COMPLETE::' + context.legId;

        let hangupCompleteWrapper = (evt) => {

            context.legStop = true;

            console.log('Leg-A hangup');

            this._inboundCallDialplan.triggerWebhookUrl(context.dialplanInstruction.dialAttribute.action,
                context.dialplanInstruction.dialAttribute.method,
                context.voiceRequestParam, () => {
                    console.log('triggered webhook end call');
            });

            connection.removeListener(hangupCompleteEvent, hangupCompleteWrapper);
        };

        connection.subscribe('CHANNEL_HANGUP_COMPLETE');

        connection.on(hangupCompleteEvent, hangupCompleteWrapper);
    }

    private getChannelVariable(headerName:string,context:InboundCallContext){

        let connection = context.conn;

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
  