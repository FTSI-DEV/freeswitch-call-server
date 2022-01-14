import { InboundCallContext } from "../models/inbound-call-context.model";

export class IvrIncomingCallVerifyHelper{

    /**
     *
     */
    constructor(
        private readonly _context: InboundCallContext,
    ) {}

    incomingCallVerify(){

        let ivrOptions = this._context.inboundRulesConfig.ivrOptions;

        if (ivrOptions){

        }

    }
}