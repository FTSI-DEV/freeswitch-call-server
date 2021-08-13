import { Controller } from '@nestjs/common';
import { EslServerHelper } from 'src/helpers/fs-esl/server';

@Controller('fs-inbound-call')
export class FsInboundCallController {


    inboundStatusCallBack(){
        //execute job here
    }

    incomingCallEnter(){

        new EslServerHelper().incomingCallEnter();

        //webhook here..
    }
}
