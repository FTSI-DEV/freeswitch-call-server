import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JsonDataListReturnModel, JsonDataListReturnModel2 } from 'src/utils/jsonDataListReturnModel';
import { InboundCallConfigModel, InboundCallConfigParam } from '../models/inbound-call-config.model';
import { InboundCallConfigService } from '../services/inbound-call-config.service';


@Controller('/api/inbound-call-config')
export class InboundCallConfigController {
  constructor(private _inboundCallConfig: InboundCallConfigService) {}

  @Get('getInboundCallConfigById/:id')
  async getInboundCallConfigById(@Param('id')id: number):Promise<JsonDataListReturnModel>{
    let config = await this._inboundCallConfig.getInboundCallConfigById(id);

    return JsonDataListReturnModel.Ok(null, config);
  }

  @Post('add')
  add(
    @Body() params: InboundCallConfigParam
  ): JsonDataListReturnModel {

    console.log(`entered -> 
      CallerId -> ${params.callerId} , 
      Webhook -> ${params.webhookUrl}, 
      HttpMethod -> ${params.httpMethod}`);

    this._inboundCallConfig.add({
      webhookUrl: params.webhookUrl,
      callerId: params.callerId,
      httpMethod: params.httpMethod
    });

    return JsonDataListReturnModel.Ok('Successfully added config');
  }

  @Post('update')
  update(
    @Body() params: InboundCallConfigParam
  ): JsonDataListReturnModel {
    this._inboundCallConfig.update({
      webhookUrl: params.webhookUrl,
      callerId: params.callerId,
      httpMethod : params.httpMethod,
      id: params.id
    });

    return JsonDataListReturnModel.Ok('Successfully updated config');
  }

  @Get('getInboundCallConfigs')
  async getInboundCallConfigs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<JsonDataListReturnModel> {
    limit = limit > 100 ? 100 : limit;

    let retVal = await this._inboundCallConfig.getInboundCallConfigs({
        page,
        limit
    });

    return JsonDataListReturnModel.Ok(null,retVal);
  }

  @Post('delete/:id')
  async deleteInboundCallConfig(@Param('id') id: number):Promise<JsonDataListReturnModel>{
    try {

      let config =  await this._inboundCallConfig.deleteInboundCallConfig(id);

      return JsonDataListReturnModel.Ok(config);
    } 
    catch(err) 
    { 
      return JsonDataListReturnModel.Error(err); 
    };
  }
}
