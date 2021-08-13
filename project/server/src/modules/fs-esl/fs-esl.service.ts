import { Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { CallDispatchHelper } from 'src/helpers/fs-esl/callDispatch.helper';
import { FreeswitchConnectionHelper } from 'src/helpers/fs-esl/eslfreeswitch.connection';
import { OriginationModel } from 'src/helpers/fs-esl/models/originate.model';
import { IFSEslService } from './fs-esl.interface';

@Injectable()
export class FsEslService implements IFSEslService {
    constructor(
        private readonly _callDispatchHelper = new CallDispatchHelper(),
        private readonly _fsConnection = new FreeswitchConnectionHelper()
    ) {}
    // private readonly _callDispatchHelper = new CallDispatchHelper();
    // private readonly _fsConnection = new FreeswitchConnectionHelper();

    clickToCall(originateParam: OriginationModel){

        let conn = this._fsConnection.startConnection(); //to be test

        this._callDispatchHelper.clickToCall(conn, originateParam);
    }

    clickToCall2(phoneNumberTo: string, phoneNumberFrom: string):string{
        
        let conn = this._fsConnection.startConnection();

        let result = this._callDispatchHelper.clickToCall2(conn, phoneNumberFrom, phoneNumberTo);

        return result;
    }
}
