import { IInboundCallConfigService } from 'src/modules/inbound-call-config/services/inbound-call-config.interface';
import { IIncomingCallService } from 'src/modules/incomingCall/services/incomingCall.interface';
import { InboundCallHelper } from './inbound-call';
import esl from 'modesl';

export let inboundCallServer = null;

export class EslServerHelper {

  constructor(
    private readonly _inboundCallConfigService: IInboundCallConfigService,
    private readonly _inboundCallService: IIncomingCallService
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

    new InboundCallHelper(this._inboundCallConfigService).inboundCallEnter();
  }
}
