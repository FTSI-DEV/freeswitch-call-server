import { Body, Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { AccountConfigModel } from '../models/accountConfig.model';
import { AccountConfigDTO } from '../models/accountConfigDto.model';
import { ACCOUNT_CONFIG_SERVICE, IAccountConfigService } from '../services/account-config.interface';

@Controller('account-config')
@UseGuards(JwtAuthGuard)
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
                authKey: config.AuthToken,
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

    @Post('add/:accountName')
    async add(
        @Param("accountName") accountName: string
    ): Promise<JsonDataListReturnModel>{

        let config = await this._accountConfigService.add(accountName);

        return JsonDataListReturnModel.Ok("Successfully added config", config);
    }

    @Post('update')
    async upate(
        @Body() params:AccountConfigModel
    ): Promise<JsonDataListReturnModel>
    {
        let success = await this._accountConfigService.update({
            accountName: params.accountName
        });

        if (success)
            return JsonDataListReturnModel.Ok("Successfully updated config");
        else
            return JsonDataListReturnModel.Error("Unable to update config");
    }

    @Post('delete')
    async delete(
        @Body() params:AccountConfigModel
    ): Promise<JsonDataListReturnModel>{
     
        let success = await this._accountConfigService.delete(params);

        if (success)
            return JsonDataListReturnModel.Ok("Successfully deleted config");
        else
            return JsonDataListReturnModel.Error("Unable to delete config");
    }
}
