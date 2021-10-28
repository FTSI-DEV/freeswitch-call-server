import { IInboundRulesConfigService } from "src/modules/inbound-rules-config/services/inbound-rules.config.interface";
import { EslServerHelper2 } from "../inbound-call2/inboundCall2.server";
import esl from 'modesl';
import { InboundCallContext } from "./models/inbound-call-context.model";
import { InboundCallHelper } from "./inbound-call";

export class InbooundCallServerHelper{
    
    constructor(
        private readonly _inboundRulesConfigService: IInboundRulesConfigService,
        private readonly _redisClient:any
    ){}

    
    startEslServer(){

        let server = new esl.Server({
            port: 6000,
            host: '0.0.0.0',
            myEvents: true
        });

        let context = new InboundCallContext();

        context.eslServer = server;

        context.redisServer = this._redisClient;

        context.serviceModel.inboundRulesConfigService = this._inboundRulesConfigService;

        new InboundCallHelper(context).inboundCallEnter();

    }

}