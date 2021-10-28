import { IInboundRulesConfigService } from "src/modules/inbound-rules-config/services/inbound-rules.config.interface";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { CallRejectedHandler } from "../../inbound-call2/handlers/callRejectedHandler";
import { WebhookUrlHelper } from "../../webhookUrl.helper";
import { InboundCallRejectedHandler } from "../handlers/callRejectedHandler";

export class InboundCallServiceModel{

    inboundRulesConfigService:IInboundRulesConfigService;
    
    callRejectedHandler = new InboundCallRejectedHandler();

    timeConversion = new TimeConversion();

    webhookUrlHelper = new WebhookUrlHelper();
}

