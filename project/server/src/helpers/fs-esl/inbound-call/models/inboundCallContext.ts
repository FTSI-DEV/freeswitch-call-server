import { DialplanInstruction } from "src/helpers/parser/xmlParser";
import { CustomAppLogger } from "src/logger/customLogger";
import { ConnResult } from "../../inbound-esl.connection";
import { VoiceRequestParam } from "../../models/voiceRequestParam";
import { WebhookParam } from "./webhookParam";

export class InboundCallContext{
    conn:any;
    voiceRequestParam: VoiceRequestParam = new VoiceRequestParam();
    dialplanInstructions: DialplanInstruction[] = [];
    dialplanInstruction : DialplanInstruction; 
    legStop: boolean = false;
    errorMessage: string;
    twiMLResponse:string;
    instructionValidated: boolean = false;
    callRejected:boolean = false;
    legId:string;
    instructionOrder:number;
    isLastDialplan:boolean=false;
    webhookParam:WebhookParam=new WebhookParam();
    logger:CustomAppLogger;
    inboundESLConnResult:ConnResult;
    Log(message:string, error:boolean=false){

        let lmsg = `CallUId: ${this.legId} => ${message}`;

        if (error) this.logger.error(lmsg,new Error(lmsg));
        else this.logger.info(lmsg);
    }
}