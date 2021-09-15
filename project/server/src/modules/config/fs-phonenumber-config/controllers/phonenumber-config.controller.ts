import { Body, Controller, Get, Post, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FreeswitchPhoneNumberConfigParam } from 'src/models/freeswitchCallConfigModel';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { FreeswitchPhoneNumberConfigService } from '../services/phonenumber-config.service';

@Controller('/api/freeswitch-phonenumber-config')
export class FreeswitchPhoneNumberConfigController {
    constructor(
        private _freeswitchCallConfigService: FreeswitchPhoneNumberConfigService
    ) {}

    @Get('getPhoneNumberConfigById/:id')
    async getPhoneNumberConfigById(@Param('id')id: number):Promise<JsonDataListReturnModel>{
        
        let config = await this._freeswitchCallConfigService.getPhoneNumberConfigById(id);

        return JsonDataListReturnModel.Ok(null, config);
    }

    @Post('add')
    add(@Body() callConfigParam: FreeswitchPhoneNumberConfigParam):JsonDataListReturnModel{
        console.log('entered', callConfigParam);

        this._freeswitchCallConfigService.add(callConfigParam);

        return JsonDataListReturnModel.Ok("Successfully saved record");
    }

    @Post('update')
    update(
        @Body() callConfigParam: FreeswitchPhoneNumberConfigParam
    ):JsonDataListReturnModel{

        this._freeswitchCallConfigService.update(callConfigParam);

        return JsonDataListReturnModel.Ok("Successfully updated record");
    }

    @Get('getPhonenumberConfigs')
    async getPhoneNumberConfigs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<JsonDataListReturnModel> {

        limit = limit > 100 ? 100 : limit;

        let retVal = await this._freeswitchCallConfigService.getPhoneNumberConfigs({
            page,
            limit
        });

        return JsonDataListReturnModel.Ok(null, retVal);
    }

  @Post('delete/:id')
   async deletePhoneNumberConfig(@Param('id') id: number):Promise<JsonDataListReturnModel> {
    try {
        let config = await this._freeswitchCallConfigService.deletePhoneNumberConfig(id);  

        return JsonDataListReturnModel.Ok(config);

    } catch(err) { return JsonDataListReturnModel.Error(err) };
  }
}
