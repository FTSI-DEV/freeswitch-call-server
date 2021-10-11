import { IInboundCallConfigService } from "src/modules/inbound-call-config/services/inbound-call-config.interface";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { CallRejectedHandler } from "../handlers/callRejectedHandler";

export class InboundCallServiceModel{
    inboundCallConfigSrvc: IInboundCallConfigService;
    callRejectedHandler = new CallRejectedHandler();
    timeConversion = new TimeConversion();
}