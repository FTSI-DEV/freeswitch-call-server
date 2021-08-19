import { Controller, Get, Param, Post } from "@nestjs/common";
import { OriginationModel } from "src/helpers/fs-esl/models/originate.model";
import { FsEslService } from "./fs-esl.service";

@Controller('freeswitch')
export class FreeswitchController{
    constructor(
        private _freeswitchService: FsEslService
    ) {}

    @Post('clickToCall')
    clickToCall(@Param('phoneNumberTo') phoneNumberTo: string, 
                @Param('phoneNumberFrom') phoneNumberFrom: string,
                @Param('callerId') callerId: string):string{
        let result = this._freeswitchService.clickToCall(phoneNumberTo, phoneNumberFrom,callerId);

        return result;
    }
}