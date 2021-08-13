import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeswitchCallConfig } from 'src/entity/freeswitchCallConfig.entity';
import { FreeswitchCallConfigModel, FreeswitchCallConfigModelParam } from 'src/models/freeswitchCallConfigModel';
import { Repository } from 'typeorm';
import { IFreeswitchCallConfigService } from './ifreeswitch-call-config.interface';

const FREESWITCH_CALL_CONFIG = 'FREESWITCH_CALL_CONFIG';

@Injectable()
export class FreeswitchCallConfigService implements IFreeswitchCallConfigService {
    constructor(
        @InjectRepository(FreeswitchCallConfig)
        private freeswitchConfigRepo: Repository<FreeswitchCallConfig>
    ) {}

    async saveCallSettings(callConfigParam: FreeswitchCallConfigModelParam){
        
        let fsCallConfig = await this.getById(callConfigParam.id);

        if (fsCallConfig == undefined){
            fsCallConfig = new FreeswitchCallConfig();

           let configModel = new FreeswitchCallConfigModel();

           configModel.friendlyName = callConfigParam.friendlyName;
           configModel.phoneNumber = callConfigParam.phoneNumber;
           configModel.httpMethod = callConfigParam.httpMethod;
           configModel.webhookUrl = callConfigParam.webhookUrl;
           
           let serializeObj = JSON.stringify(configModel);

           fsCallConfig.Name = FREESWITCH_CALL_CONFIG;
           fsCallConfig.Value = serializeObj;

           await this.freeswitchConfigRepo.save(fsCallConfig); 
        }
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
        
        return this.freeswitchConfigRepo.findOneOrFail(id);
    }
}
