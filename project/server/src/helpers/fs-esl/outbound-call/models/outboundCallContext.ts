import { CallTypes } from "src/helpers/constants/call-type";
import { DialplanInstruction } from "src/helpers/parser/xmlParser";
import { CustomAppLogger } from "src/logger/customLogger";
import { ConnResult } from "../../inbound-esl.connection";
import { ChannelStateModel } from "../../models/channelState.model";
import { WebhookParam } from "../../models/webhookParam";
import { OutboundCallServiceModel } from "./outboundCallServiceModel";
import { OutboundRequestParam } from "./outboundRequestParam.model";

export class OutboundCallContext{
    server:any;
    connection:any;
    serviceModel: OutboundCallServiceModel = new OutboundCallServiceModel();
    outboundRequestParam: OutboundRequestParam = new OutboundRequestParam();
    redisServer:any;
    legStop:boolean=false;
    logger:CustomAppLogger;
    legId:string;
    callRejected:boolean=false;
    dpInstructions:DialplanInstruction[] = [];
    twiMLResponse:string;
    webhookParam:WebhookParam = new WebhookParam();
    bridgeExecuted:boolean=false;
    channelState:ChannelStateModel = new ChannelStateModel();
    plagdNext:boolean=false;
    plagdStop:boolean=false;
    redirect:boolean=false;
    outboundChannelStateKey:string;
    inboundESLConnResult:ConnResult;
    errMessage:string[] = [];
    Log(message:string, error:boolean=false){
        let lmsg = `CallUid : ${this.legId} ,
                    CallDirection : ${CallTypes.Outbound} ,
                    Message => ${message}`;

        if (error) this.logger.error(lmsg, new Error(message));
        
        else this.logger.info(lmsg);
    }
}

