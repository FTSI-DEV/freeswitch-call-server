import { CallTypes } from "src/helpers/constants/call-type";
import { DialplanInstruction } from "src/helpers/parser/xmlParser";
import { CustomAppLogger } from "src/logger/customLogger";
import { InboundRulesConfigModel } from "src/modules/inbound-rules-config/models/inbound-rules.model";
import { IvrOptionsCommandModel } from "src/modules/inbound-rules-config/models/ivr-options.model";
import { ConnResult } from "../../inbound-esl.connection";
import { ChannelStateModel } from "../../models/channelState.model";
import { WebhookParam } from "../../models/webhookParam";
import { InboundCallServiceModel } from "./inbound-call-service.model";
import { InboundRequestParamModel } from "./inbound-request-param.model";
import { PlayAndGetDigitResultModel } from "./plagd.model";

export class InboundCallContext{
    
    connection: any;

    eslServer: any;

    redisServer: any;

    inboundChannelStateKey: string;

    serviceModel: InboundCallServiceModel = new InboundCallServiceModel();

    inboundRequestParam: InboundRequestParamModel = new InboundRequestParamModel();

    channelState: ChannelStateModel = new ChannelStateModel();

    dialplanInstructions: DialplanInstruction[] = [];

    dialplanInstruction: DialplanInstruction;

    legStop: boolean = false;

    errorMessage: string[] = [];

    twiMLResponse: string;

    instructionValidated : boolean = false;

    callRejected: boolean = false;

    legId:string;

    plagdResult : PlayAndGetDigitResultModel = new PlayAndGetDigitResultModel();

    bridgeExecuted: boolean = false;

    webhookParam: WebhookParam = new WebhookParam();

    logger: CustomAppLogger;

    inboundEslConnResult: ConnResult;

    ivrCallModel : IvrOptionsCommandModel = new IvrOptionsCommandModel();

    inboundRulesConfig : InboundRulesConfigModel = new InboundRulesConfigModel();

    Log(message:string, error:boolean=false){

        let lmsg = `CallUId: ${this.legId} ,
                    CallDirection : ${CallTypes.Inbound} ,
                    Message => ${message}`;

        if (error) this.logger.error(lmsg,new Error(lmsg));

        else this.logger.info(lmsg);
    }

}
