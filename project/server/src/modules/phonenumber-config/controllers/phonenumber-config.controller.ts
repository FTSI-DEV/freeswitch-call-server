import { Body, Controller, Get, Post, Param, Query, ParseIntPipe, DefaultValuePipe, Inject, HttpCode, UseInterceptors, HttpStatus } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserTokenInterceptor } from 'src/auth/interceptors/user-token.interceptor';
import { PhoneNumberConfigParam } from 'src/modules/phonenumber-config/models/phoneNumberConfig.model';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { IPhoneNumberConfigService, PHONENUMBER_CONFIG_SERVICE } from '../services/iphonenumber-config.interface';
import { PhoneNumberConfigService } from '../services/phonenumber-config.service';

@Controller('freeswitch-phonenumber-config')
export class FreeswitchPhoneNumberConfigController {
    constructor(
        @Inject(PHONENUMBER_CONFIG_SERVICE)
        private _phoneNumberConfigService: IPhoneNumberConfigService
    ) {}

    @Get('getPhoneNumberConfigById/:id')
    async getPhoneNumberConfigById(@Param('id')id: number):Promise<JsonDataListReturnModel>{
        
        let config = await this._phoneNumberConfigService.getById(id);

        return JsonDataListReturnModel.Ok(null,config);
    }

    @Post('add')
    add(@Body() callConfigParam: PhoneNumberConfigParam):JsonDataListReturnModel{

        this._phoneNumberConfigService.add(callConfigParam);

        return JsonDataListReturnModel.Ok("Successfully saved record");
    }

    @Post('update')
    update(
        @Body() callConfigParam: PhoneNumberConfigParam
    ):JsonDataListReturnModel{

        this._phoneNumberConfigService.update(callConfigParam);

        return JsonDataListReturnModel.Ok("Successfully updated record");
    }

    @Get('getPhonenumberConfigs')
    async getPhoneNumberConfigs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<JsonDataListReturnModel> {

        limit = limit > 100 ? 100 : limit;

        let retVal = await this._phoneNumberConfigService.getPhoneNumberConfigs({
            page,
            limit
        });

        console.log('retval -> ', retVal);

        return JsonDataListReturnModel.Ok(null, retVal);
    }

  @Post('delete/:id')
   async deletePhoneNumberConfig(@Param('id') id: number):Promise<JsonDataListReturnModel> {
    try {
        let config = await this._phoneNumberConfigService.deletePhoneNumberConfig(id);  

        return JsonDataListReturnModel.Ok(config);

    } catch(err) { return JsonDataListReturnModel.Error(err) };
  }
}
