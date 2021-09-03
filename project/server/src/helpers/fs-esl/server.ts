import { InboundCallConfigService } from 'src/modules/config/inbound-call-config/services/inbound-call-config.service';
import { InboundCallHelper } from './inbound-call';
import { modesl } from '../libs/modesl';
const esl = require('modesl');

export let eslServerRes = null;

export class EslServerHelper {

  constructor(
    private readonly _inboundCallConfigService: InboundCallConfigService,
  ) {}

  //for InboundCall
  startEslServer() {

    let esl_server = new esl.Server(
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
