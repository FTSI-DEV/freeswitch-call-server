import { Controller, Get, Param } from "@nestjs/common";
import { OriginationModel } from "src/helpers/fs-esl/models/originate.model";
import { FsEslService } from "./fs-esl.service";

@Controller('freeswitch')
export class FreeswitchController{
    constructor(
        private _freeswitchService: FsEslService
    ) {}

    @Get('clickToCall')
    clickToCall(originateParam: OriginationModel){
        this._freeswitchService.clickToCall(originateParam);
        return "Successfully triggered click-to-call";
    }

    @Get('clickToCall2')
    clickToCall2(@Param('phoneNumberTo') phoneNumberTo: string, 
                @Param('phoneNumberFrom') phoneNumberFrom: string,
                @Param('callerId') callerId: string):string{
        let result = this._freeswitchService.clickToCall2(phoneNumberTo, phoneNumberFrom,callerId);

        return result;
    }

    // //proceed to ivr
    // dialVerify(){

    // }

    // //outbound call
    // dialNumber(){

    // }

    // //completed - end call
    // dialEnd(){

    // }

    // //incoming call to connect - ivr
    // inboundCall(){
        
    // }
}