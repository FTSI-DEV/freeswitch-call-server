import { Controller, Get } from "@nestjs/common";
import { OriginateModel } from "src/helpers/fs-esl/models/originate.model";
import { FsEslService } from "./fs-esl.service";

@Controller('freeswitch')
export class FreeswitchController{
    constructor(
        private _freeswitchService: FsEslService
    ) {}

    @Get('clickToCall')
    clickToCall(originateParam: OriginateModel){
        this._freeswitchService.clickToCall(originateParam);
        return "Successfully triggered click-to-call";
    }

    //proceed to ivr
    dialVerify(){

    }

    //outbound call
    dialNumber(){

    }

    //completed - end call
    dialEnd(){

    }

    //incoming call to connect - ivr
    inboundCall(){
        
    }
}