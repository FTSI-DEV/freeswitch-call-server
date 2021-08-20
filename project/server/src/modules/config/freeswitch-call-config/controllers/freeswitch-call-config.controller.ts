import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { FreeswitchCallConfigModelParam } from 'src/models/freeswitchCallConfigModel';
import { FreeswitchCallConfigService } from '../services/freeswitch-call-config.service';

@Controller('freeswitch-call-config')
export class FreeswitchCallConfigController {
    constructor(
        private _freeswitchCallConfigService: FreeswitchCallConfigService
    ) {}

    @Get('getCallConfigById')
    getCallConfigById(@Param('id')id: number):FreeswitchCallConfigModelParam{
        
        let retVal = null;

        let fsCallConfig = this._freeswitchCallConfigService.getCallConfigById(id)
        .then((res) => {
           retVal = res;
        });

        return retVal;
    }

   @Post('saveRecord')
    saveRecord(@Body() callConfigParam: FreeswitchCallConfigModelParam){

        console.log('entered', callConfigParam);

        this._freeswitchCallConfigService.saveUpdateCallConfig(callConfigParam);

        return "Successfully saved record";
    }
}
