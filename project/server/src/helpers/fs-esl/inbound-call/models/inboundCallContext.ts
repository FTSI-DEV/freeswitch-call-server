import { DialplanInstruction } from "src/helpers/parser/xmlParser";
import { VoiceRequestParam } from "./voiceRequestParam";
import { WebhookParam } from "./webhookParam";

export class InboundCallContext{
    conn:any;
    voiceRequestParam: VoiceRequestParam = new VoiceRequestParam();
    dialplanInstructions: DialplanInstruction[] = [];
    dialplanInstruction : DialplanInstruction; 
    legStop: boolean = false;
    errorMessage: string;
    hasError: boolean = false;
    twiMLResponse:string;
    instructionValidated: boolean = false;
    callRejected:boolean = false;
    legId:string;
    instructionOrder:number;
    isLastDialplan:boolean=false;
    webhookParam:WebhookParam=new WebhookParam();
}