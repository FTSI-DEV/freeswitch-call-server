import { Controller, Get, Post } from "@nestjs/common";
import { FreeswitchCallConfigModel, FreeswitchCallConfigModelParam } from "src/models/freeswitchCallConfigModel";
import { IFreeswitchCallConfigService } from "./ifreeswitch-call-config.interface";

@Controller()
export class FreeswitchCallConfig{
    constructor(
        private _freeswitchCallConfigService: IFreeswitchCallConfigService
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