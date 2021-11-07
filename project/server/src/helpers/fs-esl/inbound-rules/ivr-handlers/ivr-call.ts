import { connect } from "http2";
import { emitWarning } from "process";
import { TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { IvrOptionsCommandModel } from "src/modules/ivr-config/models/ivr-options.model";
import { Http } from "winston/lib/winston/transports";
import { WebhookUrlHelper } from "../../webhookUrl.helper";
import { InboundCallContext } from "../models/inbound-call-context.model";
import { PlayAndGetDigitsParamModel } from "../models/plagd-param.model";

export class IvrCallHelper{

    constructor(
        private _context: InboundCallContext,
        private readonly _twiMLParser = new TwiMLXMLParser(_context.redisServer)
    ){}

    
    ivrIncomingCallEnter(){
        
        var connection = this._context.connection;

        var ivrOptions = this._context.inboundRulesConfig.ivrOptions;

        if (ivrOptions){

            this.executeWelcomeMessage(ivrOptions, () => {});

            for (let i = 0; i < ivrOptions.ivrRetryCount; i++){
    
                this.addIvr(ivrOptions, () => {});
    
                this.addNoInput(ivrOptions, () => {});
            }
    
            this.addIvr(ivrOptions, () => {});
        }
        else{

            this._context.callRejected = true;

            this._context.serviceModel.callRejectedHandler.reject(this._context, () => {});

            return;
        }

        // execute call verify
    }

    addNoInput(ivrOptions:IvrOptionsCommandModel, callback){

        let recordUrl = this.getRecordUrl(ivrOptions.failedRetryMessage);

        if (recordUrl){
            this.executePlayback(recordUrl, () => callback());
        }
        else{
            
            let failedRetry = ivrOptions.failedRetryMessage ? ivrOptions.failedRetryMessage : "Please try again";

            this.executeSpeak(failedRetry, () => callback());

            this.addPause(() => callback());
        }

    }

    addPause(callback){

        this._context.connection.execute('sleep', 1000, () =>{
            callback();
        });
    }

    addIvr(ivrOptions:IvrOptionsCommandModel, callback){

        let PLAGD = this.setPLAGD();

        let recordUrl = this.getRecordUrl(ivrOptions.ivrScript);

        if (recordUrl){

            PLAGD.soundFile = recordUrl;
        }
        else{
            //script lines here..
        }

        this._context.connection.execute('play_and_get_digits',
            `${PLAGD.minValue} ${PLAGD.maxValue} ${PLAGD.tries} ${PLAGD.timeout} ${PLAGD.soundFile} ${PLAGD.invalidFile} ${PLAGD.var_name} ${PLAGD.regexValue}`, 
            (cb) => {

                this._context.channelState = {
                    legId: this._context.legId,
                    channelState : cb.getHeader('Channel-State'),
                    answerState: cb.getHeader('Answer-State')
                }
    
                this._context.redisServer.set(this._context.inboundChannelStateKey, 
                    JSON.stringify(this._context.channelState), (err,reply) => {
    
                        this._context.Log(`Redis state set: 
                        Key: ${this._context.inboundChannelStateKey} ,
                        Reply: ${reply} , 
                        Error: ${err}`);
                        
                });
    
                let inputtedDigit = cb.getHeader(`variable_${PLAGD.var_name}`);
    
                let hasInputtedDigit = cb.getHeader(`variable_read_result`);
    
                if (hasInputtedDigit === 'failure'){
    
                    this._context.plagdResult.plagdNext = true;
    
                    callback(this._context);
                }
                else
                {
                    // this._context.outboundRequestParam.Digits = inputtedDigit;
                    
                    this._context.plagdResult.plagdStop = true;
    
                    callback(this._context);
                }
        });
    }

    setPLAGD():PlayAndGetDigitsParamModel{

        let timeout = this._context.serviceModel.timeConversion
            .secondsToMS(10);

        return {
            minValue: 1,
            maxValue: 11,
            tries : 1,
            timeout: timeout,
            terminator: '#',
            regexValue: "1",
            var_name: 'ivrCall_target_num'
        }

    }

    executeWelcomeMessage(ivrOptions:IvrOptionsCommandModel, callback){

        if (ivrOptions.welcomeRecordUrl){

            this.executePlayback(ivrOptions.welcomeRecordUrl, () => {
                callback();
            });
        }
        else{

            let recordUrl = this.getRecordUrl(ivrOptions.welcomeMessage);

            if (recordUrl){
                this.executePlayback(recordUrl, () => {
                    callback();
                });
            }
            else{
                this.executeSpeak(ivrOptions.welcomeMessage, () => {
                    callback();
                });
            }
        }

    }

    executePlayback(message:string, callback){

        this._context.connection.execute('playback', message, () => {
            callback();
        });
    }

    executeSpeak(message:string, callback){

        this._context.connection.execute('speak', `flite|kal|${message}`, () => {
            callback();
        });
    }

    getRecordUrl(strObj:string):string{

        if (strObj){

            if (strObj.length >= 6){

                let recordUrl = strObj.substring(0,6);

                if (recordUrl.startsWith("http:") ||
                    recordUrl.startsWith("https:")){

                    return strObj;
                }

            }
        }

        return null;
    }
}

