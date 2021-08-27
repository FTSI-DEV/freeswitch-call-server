import { Body, Controller, Get, Post, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FreeswitchPhoneNumberConfigParam } from 'src/models/freeswitchCallConfigModel';
import { FreeswitchPhoneNumberConfigService } from '../services/phonenumber-config.service';

@Controller('/api/freeswitch-phonenumber-config')
export class FreeswitchPhoneNumberConfigController {
    constructor(
        private _freeswitchCallConfigService: FreeswitchPhoneNumberConfigService
    ) {}

    @Get('getPhoneNumberConfigById/:id')
    getPhoneNumberConfigById(@Param('id')id: number):any{
        
        return this._freeswitchCallConfigService.getPhoneNumberConfigById(id);
    }

    @Post('add')
    add(@Body() callConfigParam: FreeswitchPhoneNumberConfigParam):string{
        console.log('entered', callConfigParam);

        this._freeswitchCallConfigService.add(callConfigParam);

        return "Successfully saved record";
    }

    @Post('update')
    update(@Body() callConfigParam: FreeswitchPhoneNumberConfigParam):string{

        callConfigParam.id = 3;
        this._freeswitchCallConfigService.update(callConfigParam);

        return "Successfully updated record";
    }

    @Get('getPhonenumberConfigs')
    getPhoneNumberConfigs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<FreeswitchPhoneNumberConfigParam>> {
    limit = limit > 100 ? 100 : limit;
    return this._freeswitchCallConfigService.getAll({
        page,
        limit
    });
  }
}
