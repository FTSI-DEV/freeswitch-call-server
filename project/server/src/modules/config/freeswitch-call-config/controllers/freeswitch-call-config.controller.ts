import { Body, Controller, Get, Post, Param } from '@nestjs/common';
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
}
