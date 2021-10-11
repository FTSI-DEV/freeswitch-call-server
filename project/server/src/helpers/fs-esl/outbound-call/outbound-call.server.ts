import esl from 'modesl';
import { ICallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.interface';
import { OutboundCallContext } from './models/outboundCallContext';
import { OutboundCallHelper } from './outbound-call';

export class OutboundCallServerHelper{

    constructor(
        private readonly _callDetailRecordService: ICallDetailRecordService,
        private readonly _client
    ){}

    startOutboundCallServer(){

        let server = new esl.Server({
            port: 8000,
            host: '0.0.0.0',
            myevents: true,
        });

        let context = new OutboundCallContext();

        context.server = server;

        context.serviceModel.callDetailRecordSrvc = this._callDetailRecordService;
        
        context.redisServer = this._client;

        new OutboundCallHelper(context).outboundCallEnter();
    }
}