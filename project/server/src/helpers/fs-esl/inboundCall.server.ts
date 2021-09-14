import { InboundCallConfigService } from 'src/modules/config/inbound-call-config/services/inbound-call-config.service';
import { InboundCallHelper } from './inbound-call';
import { InboundCallHelper2 } from './inbound-call2';
const esl = require('modesl');

export let inboundCallServer = null;

export class EslServerHelper {

  constructor(
    private readonly _inboundCallConfigService: InboundCallConfigService,
  ) {}

  //for InboundCall
  startEslServer() {

    let server = new esl.Server(
      {
        port: 6000,
        host: '0.0.0.0',
        myevents: true,
      }
    );

    inboundCallServer = server;

    // new InboundCallHelper(this._inboundCallConfigService).inboundCallEnter();

    new InboundCallHelper2(this._inboundCallConfigService).inboundCallEnter();
  }
}
