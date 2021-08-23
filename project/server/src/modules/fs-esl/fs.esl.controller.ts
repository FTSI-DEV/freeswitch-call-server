import { Controller, Get, Param, Post } from "@nestjs/common";
import { OriginationModel } from "src/helpers/fs-esl/models/originate.model";
import { FsEslService } from "./fs-esl.service";

@Controller('/api/freeswitch')
export class FreeswitchController{
    constructor(
        private _freeswitchService: FsEslService
    ) {}

    @Post('clickToCall/:phoneNumberFrom/:phoneNumberTo/:callerId')
    clickToCall(@Param('phoneNumberFrom')phoneNumberFrom:string,
                @Param('phoneNumberTo')phoneNumberTo:string,
                @Param('callerId')callerId:string):string{

        console.log(`CTC PARAM - ${phoneNumberFrom}, 
                    phoneNumberTo - ${phoneNumberTo} , 
                    callerId - ${callerId}`);

        let result = this._freeswitchService.clickToCall(phoneNumberTo, phoneNumberFrom,callerId);

        return 'triggered';
    }
}