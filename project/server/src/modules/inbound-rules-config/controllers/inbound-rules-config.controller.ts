import { Body, Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { BaseGuard } from 'src/auth/guards/base.guard';
import { CallTypes } from 'src/helpers/constants/call-type';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { CallTypeEnum } from '../enums/call-type.enum';
import { CallType } from '../models/call-types.model';
import { InboundRulesConfigParamModel } from '../models/inbound-rules-param.model';
import { InboundRulesConfigModel } from '../models/inbound-rules.model';
import { IvrOptionsParam } from '../models/ivr-options-param.model';
import { IvrOptionsModel } from '../models/ivr-options.model';
import { IInboundRulesConfigService, INBOUND_RULES_CONFIG_SERVICE } from '../services/inbound-rules.config.interface';

@UseGuards(BaseGuard)
@Controller('inbound-rules-config')
export class InboundRulesConfigController {

    constructor(
        @Inject(INBOUND_RULES_CONFIG_SERVICE)
        private readonly _inboundRulesConfigService: IInboundRulesConfigService
    ){}

    @Get('getConfigById:/id')
    async getById(@Param('id') id: number) : Promise<JsonDataListReturnModel>{

        let ivrConfig = await this._inboundRulesConfigService.getById(id);

        return JsonDataListReturnModel.Ok(null, ivrConfig);
    }

    @Post('createInboundConfig')
    async createInboundConfig(
        @Body() params : InboundRulesConfigParamModel
    ): Promise<JsonDataListReturnModel>{

        let model = this.mappedInboundConfig(params);

        await this._inboundRulesConfigService.add(model);

        return JsonDataListReturnModel.Ok('Successfully added config');
    }

    @Post('updateInboundConfig')
    async updateInboundConfig(
        @Body() params: InboundRulesConfigParamModel
    ): Promise<JsonDataListReturnModel>{

        let model = this.mappedInboundConfig(params);

        let isSuccess = await this._inboundRulesConfigService.update(model);

        if (isSuccess){
            return JsonDataListReturnModel.Ok("Successfully updated config");
        }
        else{
            return JsonDataListReturnModel.Error("Error updating config");
        }

    }

    @Get('getInboundConfigs')
    async getInboundConfigs(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<JsonDataListReturnModel> {
      
        limit = limit > 50 ? 50 : limit;

        let retVal = await this._inboundRulesConfigService.getConfigs({
            page,
            limit
        });

        return JsonDataListReturnModel.Ok(null,retVal);

    }

    @Post('delete/:id')
    async deleteConfig(
        @Param('id') id: number
    ):Promise<JsonDataListReturnModel>{

        let success = await this._inboundRulesConfigService.delete(id);

        if (success)
            return JsonDataListReturnModel.Ok("Successfully deleted config.");
        else
            return JsonDataListReturnModel.Error("Unable to delete config.");

    }

    @Get('getCallTypes')
    async getCallTypes(): Promise<JsonDataListReturnModel>{

        var callTypes : CallType[] = [];

        callTypes.push({
            id: 1,
            name: CallTypeEnum.IVR.toString()
        });

        callTypes.push({
            id: 2,
            name: CallTypeEnum.Inbound.toString()
        })

        return JsonDataListReturnModel.Ok(null, callTypes);
    }

    private mappedInboundConfig(params: InboundRulesConfigParamModel):InboundRulesConfigModel{

        let model = new InboundRulesConfigModel();

        let ivrOptionsObj : IvrOptionsModel[] = [];

        let options : IvrOptionsParam[] = params.ivrOptions.ivrOptions;

        if (options !== [] ){
            
            options.forEach(item => {
                ivrOptionsObj.push({
                    callTypeId: item.callTypeId,
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
