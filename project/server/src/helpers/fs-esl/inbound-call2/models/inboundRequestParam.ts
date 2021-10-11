import { VoiceRequestParam } from "../../models/voiceRequestParam";

export class InboundRequestParam extends VoiceRequestParam{
    SystemId:number;
    StoreId:number;
    AccountSID:string;
    ProspectId?:number;
    AnsweredByUserId?:number;
}