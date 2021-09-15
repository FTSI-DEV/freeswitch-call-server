import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
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
  async add(
    @Body() params: InboundCallConfigParam
  ): Promise<JsonDataListReturnModel> {

    await this._inboundCallConfig.add({
      webhookUrl: params.webhookUrl,
      callerId: params.callerId,
      httpMethod: params.httpMethod
    });

    return JsonDataListReturnModel.Ok('Successfully added config');
  }

  @Post('update')
  async update(
    @Body() params: InboundCallConfigParam
  ): Promise<JsonDataListReturnModel> {

    try{
      let isSuccess = await this._inboundCallConfig.update({
              webhookUrl: params.webhookUrl,
              callerId: params.callerId,
              httpMethod : params.httpMethod,
              id: params.id
            });

      if (isSuccess){
        return JsonDataListReturnModel.Ok("Successfully updated config");
      }
      else
      {
        return JsonDataListReturnModel.Error("Unable to update config");
      }
    }
    catch(err){
      return JsonDataListReturnModel.Error('Error updating config -> ', err);
    }
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
