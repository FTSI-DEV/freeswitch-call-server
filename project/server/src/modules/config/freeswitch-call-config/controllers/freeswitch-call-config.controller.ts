import { Body, Controller, Get, Post, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FreeswitchCallConfig } from 'src/entity/freeswitchCallConfig.entity';
import { FreeswitchCallConfigModelParam } from 'src/models/freeswitchCallConfigModel';
import { FreeswitchCallConfigService } from '../services/freeswitch-call-config.service';

@Controller('freeswitch-call-config')
export class FreeswitchCallConfigController {
    constructor(
        private _freeswitchCallConfigService: FreeswitchCallConfigService
    ) {}

    @Get('getCallConfigById/:id')
    async getCallConfigById(@Param('id')id: number):Promise<FreeswitchCallConfigModelParam>{
        
        return await this._freeswitchCallConfigService.getCallConfigById(id);
    }

   @Post('saveRecord')
    saveRecord(@Body() callConfigParam: FreeswitchCallConfigModelParam){

        console.log('entered', callConfigParam);

        this._freeswitchCallConfigService.saveUpdateCallConfig(callConfigParam);

        return "Successfully saved record";
    }

    @Get('getCallConfigs')
    getCallConfigs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<FreeswitchCallConfigModelParam>> {
    limit = limit > 100 ? 100 : limit;
    return this._freeswitchCallConfigService.getAll({
        page,
        limit
    });
  }
    
}
