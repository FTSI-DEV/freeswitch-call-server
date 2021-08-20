import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeswitchCallConfig, FreeswitchCallConfigRepository } from 'src/entity/freeswitchCallConfig.entity';
import { FreeswitchCallConfigModel, FreeswitchCallConfigModelParam } from 'src/models/freeswitchCallConfigModel';
import { Repository } from 'typeorm';
import { IFreeswitchCallConfigService } from './ifreeswitch-call-config.interface';

const FREESWITCH_CALL_CONFIG = 'FREESWITCH_CALL_CONFIG';

@Injectable()
export class FreeswitchCallConfigService implements IFreeswitchCallConfigService {
    constructor(
        @InjectRepository(FreeswitchCallConfigRepository)
        private freeswitchConfigRepo: FreeswitchCallConfigRepository
    ) {}

    async saveUpdateCallConfig(callConfigParam: FreeswitchCallConfigModelParam){
        
        let fsCallConfig = await this.getById(callConfigParam.id);

        if (fsCallConfig == null){

            fsCallConfig = new FreeswitchCallConfig();

            fsCallConfig.Name = FREESWITCH_CALL_CONFIG;
        }

        let configModel: FreeswitchCallConfigModel = {
            friendlyName: callConfigParam.friendlyName,
            httpMethod: callConfigParam.httpMethod,
            phoneNumber: callConfigParam.phoneNumber,
            webhookUrl: callConfigParam.webhookUrl
        };

        fsCallConfig.Value = JSON.stringify(configModel);

        this.freeswitchConfigRepo.saveUpdateRecord(fsCallConfig);
    }

    async getCallConfigById(id: number):Promise<FreeswitchCallConfigModelParam>{

        let fsCallConfig = await this.getById(id);

        if (fsCallConfig != undefined){

            var deserialize = JSON.parse(fsCallConfig.Value);

            if (deserialize != undefined){
                return{
                    friendlyName: deserialize.friendlyName,
                    phoneNumber: deserialize.phoneNumber,
                    httpMethod: deserialize.httpMethod,
                    webhookUrl: deserialize.webhookUrl,
                    id: fsCallConfig.Id
                };
            }
        }

        return null;
    }

    getById(id:number):Promise<FreeswitchCallConfig>{
        
        return this.freeswitchConfigRepo.getById(id);
    }
}
