import { InboundCallConfigService } from 'src/modules/config/inbound-call-config/services/inbound-call-config.service';
import { CDRHelper } from './cdr.helper';
import { InboundCallHelper } from './inbound-call';
import { modesl } from '../libs/modesl';

export let eslServerRes = null;

export class EslServerHelper {

  constructor(
    private readonly _inboundCallConfigService: InboundCallConfigService,
    private readonly _callRecords = new CDRHelper(),
  ) {}

  //for InboundCall
  startEslServer() {

    let esl_server = new modesl.Server(
      {
        port: 6000,
        host: '192.168.18.3',
        myevents: true,
      },

      function () {
        console.log('ESL SERVER - OUTBOUND ESL IS UP!');
      },
    );

    eslServerRes = esl_server;

    new InboundCallHelper(this._inboundCallConfigService).inboundCallEnter();
  }
}
