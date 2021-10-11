import { CallTypes } from "src/helpers/constants/call-type";
import { DialplanInstruction } from "src/helpers/parser/xmlParser";
import { CustomAppLogger } from "src/logger/customLogger";
import { ConnResult } from "../../inbound-esl.connection";
import { ChannelStateModel } from "../../models/channelState.model";
import { VoiceRequestParam } from "../../models/voiceRequestParam";
import { WebhookParam } from "../../models/webhookParam";
import { InboundCallServiceModel } from "./inboundCallServiceModel";
import { InboundRequestParam } from "./inboundRequestParam";

export class PlayAndGetDigitResult{
    plagdNext:boolean=false;
    plagdStop:boolean=false;
}

export class InboundCallContext{
    connection:any;
    server:any;
    redisServer:any;
    redisServerName="inbound_channelState";
    serviceModel: InboundCallServiceModel = new InboundCallServiceModel();
    requestParam: InboundRequestParam = new InboundRequestParam();
    channelState:ChannelStateModel = new ChannelStateModel();
    dialplanInstructions: DialplanInstruction[] = [];
    dialplanInstruction : DialplanInstruction; 
    legStop: boolean = false;
    errorMessage: string[] = [];
    twiMLResponse:string;
    instructionValidated: boolean = false;
    callRejected:boolean = false;
    legId:string;
    plagdResult:PlayAndGetDigitResult = new PlayAndGetDigitResult();
    instructionOrder:number;
    isLastDialplan:boolean=false;
    bridgeExecuted:boolean=false;
    webhookParam:WebhookParam=new WebhookParam();
    logger:CustomAppLogger;
    inboundESLConnResult:ConnResult;
    Log(message:string, error:boolean=false){

        let lmsg = `CallUId: ${this.legId} ,
                    CallDirection : ${CallTypes.Inbound} ,
                    Message => ${message}`;

        if (error) this.logger.error(lmsg,new Error(lmsg));

        else this.logger.info(lmsg);
    }
}