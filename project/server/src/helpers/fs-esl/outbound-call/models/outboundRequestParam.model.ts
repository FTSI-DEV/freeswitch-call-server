import { VoiceRequestParam } from "../../models/voiceRequestParam";

export class OutboundRequestParam extends VoiceRequestParam{
    NumberToCall:string;
    DisplayCallerId:string;
    ActionId?:number;
}