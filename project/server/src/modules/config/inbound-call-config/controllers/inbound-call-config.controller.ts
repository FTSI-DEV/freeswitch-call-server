import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { InboundCallConfigModel } from '../models/inbound-call-config.model';
import { InboundCallConfigService } from '../services/inbound-call-config.service';

@Controller('/api/inbound-call-config')
export class InboundCallConfigController {
  constructor(private _inboundCallConfig: InboundCallConfigService) {}

  @Get('getInboundCallConfigById/:id')
  getInboundCallConfigById(@Param('id')id: number):Promise<InboundCallConfigModel>{
    return this._inboundCallConfig.getInboundCallConfigById(id);
  }

  @Post('add/:callerId/:webhookUrl/:httpMethod')
  add(
    @Param('callerId') callerId: string,
    @Param('webhookUrl') webhookUrl: string,
    @Param('httpMethod') httpMethod:string
  ): string {

    console.log('entered', webhookUrl);
    // this._inboundCallConfig.add({
    //   webhookUrl: webhookUrl,
    //   callerId: callerId,
    //   httpMethod: httpMethod
    // });

    return 'Successfully added config';
  }

  @Post('update/:/callerId/:webhookUrl/:httpMethod')
  update(
    @Param('callerId') callerId: string,
    @Param('webhookUrl') webhookUrl: string,
    @Param('httpMethod') httpMethod:string
  ): string {
    this._inboundCallConfig.update({
      webhookUrl: webhookUrl,
      callerId: callerId,
      httpMethod : httpMethod
    });

    return 'Successfully updated config';
  }

  @Get('getInboundCallConfigs')
  getInboundCallConfigs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<InboundCallConfigModel>> {
    limit = limit > 100 ? 100 : limit;
    return this._inboundCallConfig.getInboundCallConfigs({
        page,
        limit
    });
  }
}
