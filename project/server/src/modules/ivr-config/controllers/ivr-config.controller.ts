import { Body, Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { BaseGuard } from 'src/auth/guards/base.guard';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { IvrConfigParam } from '../models/ivr-config-param.model';
import { IvrConfigModel } from '../models/ivr-config.model';
import { IvrOptionsParam } from '../models/ivr-options-param.model';
import { IvrOptionsModel } from '../models/ivr-options.model';
import { IIvrConfigService, IVR_CONFIG_SERVICE } from '../services/ivr-config.interface';

@UseGuards(BaseGuard)
@Controller('ivr-config')
export class IvrConfigController {

    constructor(
        @Inject(IVR_CONFIG_SERVICE)
        private readonly _ivrConfigService: IIvrConfigService
    ){}

    @Get('getIvrConfigById:/id')
    async getById(@Param('id') id: number) : Promise<JsonDataListReturnModel>{

        let ivrConfig = await this._ivrConfigService.getById(id);

        return JsonDataListReturnModel.Ok(null, ivrConfig);
    }

    @Post('createIvrConfig')
    async createIvrConfig(
        @Body() params : IvrConfigParam
    ): Promise<JsonDataListReturnModel>{

        let model = this.mappedIvrConfigModel(params);

        await this._ivrConfigService.add(model);

        return JsonDataListReturnModel.Ok('Successfully added config');
    }

    @Post('updateIvrConfig')
    async updateIvrConfig(
        @Body() params: IvrConfigParam
    ): Promise<JsonDataListReturnModel>{

        let model = this.mappedIvrConfigModel(params);

        let isSuccess = await this._ivrConfigService.update(model);

        if (isSuccess){
            return JsonDataListReturnModel.Ok("Successfully updated config");
        }
        else{
            return JsonDataListReturnModel.Error("Error updating config");
        }

    }

    @Get('getIvrConfigs')
    async getIvrConfigs(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<JsonDataListReturnModel> {
      
    limit = limit > 100 ? 100 : limit;

    let retVal = await this._ivrConfigService.getIvrConfigs({
        page,
        limit
    });

    return JsonDataListReturnModel.Ok(null,retVal);

  }

    @Post('delete/:id')
    async deleteIvrConfig(
        @Param('id') id: number
    ):Promise<JsonDataListReturnModel>{

        let success = await this._ivrConfigService.delete(id);

        if (success)
            return JsonDataListReturnModel.Ok("Successfully deleted config.");
        else
            return JsonDataListReturnModel.Error("Unable to delete config.");

    }


    private mappedIvrConfigModel(params: IvrConfigParam):IvrConfigModel{

        let model = new IvrConfigModel();

        let ivrOptionsObj : IvrOptionsModel[] = [];

        let options : IvrOptionsParam[] = params.ivrOptions.ivrOptions;

        if (options !== [] ){
            
            options.forEach(item => {
                ivrOptionsObj.push({
                    typeId: item.typeId,
                    digitNumberInput: item.digitNumberInput,
                    forwardingNumber: item.forwardingNumber
                });
            });
        }

        model.accountId = params.accountId;
        model.isDeleted = params.isDeleted;
        model.callerId = params.callerId;
        model.webhookUrl = params.webhookUrl;
        model.httpMethod = params.httpMethod;
        model.ivrOptions  =  {
            ivrScript: params.ivrOptions.ivrScript,
            welcomeMessage : params.ivrOptions.welcomeMessage,
            welcomeRecordUrl : params.ivrOptions.welcomeRecordUrl,
            failedRetryMessage: params.ivrOptions.failedRetryMessage,
            failedMessage: params.ivrOptions.failedMessage,
            redirectMessage: params.ivrOptions.redirectMessage,
            wrongInputRetryMessage : params.ivrOptions.wrongInputRetryMessage,
            ivrRetryCount : params.ivrOptions.ivrRetryCount,
            preRedirectMessage : params.ivrOptions.preRedirectMessage,
            ivrOptions : ivrOptionsObj
        }

        return model;
    }

}
