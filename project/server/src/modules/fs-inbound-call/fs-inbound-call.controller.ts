import { Controller } from '@nestjs/common';
import { EslServerHelper } from 'src/helpers/fs-esl/server';

@Controller('fs-inbound-call')
export class FsInboundCallController {


    inboundStatusCallBack(){
        //execute job here
        //save the CDR in the job
    }

    incomingCallEnter(){

        new EslServerHelper().incomingCallEnter();

        //webhook here..
    }
}
