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

        server.on('connection::ready', (conn) => {

            // conn.execute('play_and_get_digits',
            // `1 1 2 10000 # null null sample_ivr 1`, (c:any) => {
            //     console.log('Play and get digits -> ', c);
            // });

            conn.execute('speak', 'Press 1 for sales speak_ivr ivr/ivr-call_cannot_be_completed_as_dialed.wav 5000 2 flite kal #', (c) =>{

                console.log('Speak -> ', c);
            })

        });

        // new OutboundCallHelper(context).outboundCallEnter();
    }
}