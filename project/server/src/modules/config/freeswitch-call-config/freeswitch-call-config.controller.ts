import { Controller, Get, Post } from "@nestjs/common";
import { FreeswitchCallConfigModelParam } from "src/models/freeswitchCallConfigModel";
import { FreeswitchCallConfigService } from "./freeswitch-call-config.service";
import { IFreeswitchCallConfigService } from "./ifreeswitch-call-config.interface";

@Controller()
export class FreeswitchCallConfigController{
    constructor(
        private _freeswitchCallConfigService: FreeswitchCallConfigService
    ) {}

    @Get()
    getCallConfigById(id: number):FreeswitchCallConfigModelParam{
        
        let fsCallConfig = this._freeswitchCallConfigService.getCallConfigById(id)
        .then((res) => {
            return res;
        });

        return null;
    }

    @Post()
    saveRecord(callConfigParam: FreeswitchCallConfigModelParam){
        this._freeswitchCallConfigService.saveCallSettings(callConfigParam);

        return "Successfully saved record";
    }
}