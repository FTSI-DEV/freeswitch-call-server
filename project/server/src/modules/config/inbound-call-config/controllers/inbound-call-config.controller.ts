import { Controller, Get, Param, Post } from '@nestjs/common';
import { InboundCallConfigModel } from '../models/inbound-call-config.model';
import { InboundCallConfigService } from '../services/inbound-call-config.service';

@Controller('/inbound-call-config')
export class InboundCallConfigController {
  constructor(private _inboundCallConfig: InboundCallConfigService) {}

  @Get('getInboundCallConfig/:phoneNumberTo')
  getInboundCallConfig(
    @Param('/phoneNumberTo') phoneNumberTo: string,
  ): InboundCallConfigModel {
    return this._inboundCallConfig.getInboundCallByPhoneNumber(phoneNumberTo);
  }

  @Post('add/:phoneNumberTo/:callerId/:callForwardingNumber')
  add(
    @Param('phoneNumberTo') phoneNumberTo: string,
    @Param('callerId') callerId: string,
    @Param('callForwardingNumber') callForwardingNumber: string,
  ): string {
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
