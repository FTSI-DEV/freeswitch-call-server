import { Controller, Get, Param, Post } from '@nestjs/common';
import { InboundCallConfigModel } from '../models/inbound-call-config.model';
import { InboundCallConfigService } from '../services/inbound-call-config.service';

@Controller('/api/inbound-call-config')
export class InboundCallConfigController {
  constructor(private _inboundCallConfig: InboundCallConfigService) {}

  @Get('getInboundCallConfig/:callForwardingNumber')
  getInboundCallConfig(
    @Param('callForwardingNumber') callForwardingNumber: string,
  ): any {

    this._inboundCallConfig.getInboundCallConfigByCallForwardingNo(callForwardingNumber);
  }

  @Post('add/:phoneNumberTo/:callerId/:callForwardingNumber')
  add(
    @Param('phoneNumberTo') phoneNumberTo: string,
    @Param('callerId') callerId: string,
    @Param('callForwardingNumber') callForwardingNumber: string,
  ): string {

    console.log('entered');
    this._inboundCallConfig.add({
      phoneNumberTo: phoneNumberTo,
      callForwardingNumber: callForwardingNumber,
      callerId: callerId,
    });

    return 'Successfully added config';
  }

  @Post('update/:phoneNumberTo:/callerId/:callForwardingNumber')
  update(
    @Param('phoneNumberTo') phoneNumberTo: string,
    @Param('callerId') callerId: string,
    @Param('callForwardingNumber') callForwardingNumber: string,
  ): string {
    this._inboundCallConfig.update({
      phoneNumberTo: phoneNumberTo,
      callForwardingNumber: callForwardingNumber,
      callerId: callerId,
    });

    return 'Successfully updated config';
  }
}
