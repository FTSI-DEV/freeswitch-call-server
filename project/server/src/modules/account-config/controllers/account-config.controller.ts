import { Body, Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { AccountConfigModel } from '../models/accountConfig.model';
import { AccountConfigDTO } from '../models/accountConfigDto.model';
import { ACCOUNT_CONFIG_SERVICE, IAccountConfigService } from '../services/account-config.interface';

@Controller('account-config')
export class AccountConfigController {

    constructor(
        @Inject(ACCOUNT_CONFIG_SERVICE)
        private readonly _accountConfigService: IAccountConfigService
    ){}

    @Get('getAccountConfigById/:id')
    async getAccountConfigById(
        @Param("id") id: number
    ) : Promise<JsonDataListReturnModel>{

        let config = await this._accountConfigService.getById(id);

        if (config !== undefined)
        {
            let accountConfigDTO : AccountConfigDTO = {
                id: config.Id,
                accountName: config.AccountName,
                authKey: config.AuthKey,
                isActive: config.IsActive,
                dateCreated: config.DateCreated,
                accountSID: config.AccountSID
            };

            return JsonDataListReturnModel.Ok(null, accountConfigDTO);
        }

        return JsonDataListReturnModel.Ok('No records to be displayed');
    }

    @Get('getAccountConfigs')
    async getAccountConfigs(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
      ): Promise<JsonDataListReturnModel> {
    
        limit = limit > 10 ? 10 : limit;
    
        let configs = await this._accountConfigService.getConfigs({
          page,
          limit
        });
    
        return JsonDataListReturnModel.Ok(null, configs);
      }

    @Post('add')
    async add(
        @Body() params: AccountConfigModel
    ): Promise<JsonDataListReturnModel>{

        let config = await this._accountConfigService.add({
            accountName: params.accountName,
            accountSID: params.accountSID,
            authToken: params.accountSID,
            isActive: params.isActive
        });

        return JsonDataListReturnModel.Ok("Successfully added config", config);
    }

    @Post('update')
    async upate(
        @Body() params:AccountConfigModel
    ): Promise<JsonDataListReturnModel>
    {
        let success = await this._accountConfigService.update({
            isActive: params.isActive,
            accountName: params.accountName
        });

        if (success)
            return JsonDataListReturnModel.Ok("Successfully updated config");
        else
            return JsonDataListReturnModel.Error("Unable to update config");
    }
}
