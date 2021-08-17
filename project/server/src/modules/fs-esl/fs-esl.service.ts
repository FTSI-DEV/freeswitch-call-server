import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { stringify } from 'querystring';
import { CallDispatchHelper } from 'src/helpers/fs-esl/callDispatch.helper';
import { FreeswitchConnectionHelper } from 'src/helpers/fs-esl/eslfreeswitch.connection';
import { OriginationModel } from 'src/helpers/fs-esl/models/originate.model';
import { IFSEslService } from './fs-esl.interface';

@Injectable()
export class FsEslService {
  constructor() 
  {}
  private readonly _callDispatchHelper = new CallDispatchHelper();
  private readonly _fsConnection = new FreeswitchConnectionHelper();

  clickToCall(originateParam: OriginationModel) {
    let conn = this._fsConnection.connect(); //to be test

    this._callDispatchHelper.clickToCall(conn, originateParam);
  }

  clickToCall2(
    phoneNumberTo: string,
    phoneNumberFrom: string,
    callerId: string,
  ): string {
    let conn = new FreeswitchConnectionHelper().connect().then((connection) => {

      console.log('EXECUTING CLICK-TO-CALL');

      let app_args = 'sofia/gateway/fs-test1/1000'; //destinationNumber;
      let arg1 = `{ignore_early_media=true,origination_caller_id_number=${phoneNumberFrom}}${app_args}`;
    //  let arg2 = `${arg1} &bridge(${phoneNumberTo})`;
        let arg2 = `${arg1} &bridge(sofia/gateway/fs-test3/1000)`;

        connection.execute('set',`outbound_caller_id_number=${callerId}`);

      connection.api('originate', arg2, function (res) {
        let callUid = res.getBody();

        console.log('Originate', callUid);

        return callUid;
      });
    });
    return 'Error click to call';
  }
}
