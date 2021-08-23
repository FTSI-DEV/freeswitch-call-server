import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { stringify } from 'querystring';
import { CallDispatchHelper } from 'src/helpers/fs-esl/callDispatch.helper';
import { FreeswitchConnectionHelper } from 'src/helpers/fs-esl/eslfreeswitch.connection';
import { OriginationModel } from 'src/helpers/fs-esl/models/originate.model';
import { IFSEslService } from './fs-esl.interface';

@Injectable()
export class FsEslService {

  constructor() {}
  
  private readonly _callDispatchHelper = new CallDispatchHelper();
  private readonly _fsConnection = new FreeswitchConnectionHelper();

  clickToCall(
    phoneNumberTo: string,
    phoneNumberFrom: string,
    callerId: string,
  ): string {

    console.log(`PARAMATERS phoneNumberTo: ${phoneNumberTo} , phoneNumberFrom: ${phoneNumberFrom}, callerId: ${callerId}`);

    
    let conn = this._fsConnection.connect().then((connection) => {

      console.log('EXECUTING CLICK-TO-CALL');

      console.log(`PARAMATERS phoneNumberTo: ${phoneNumberTo} , phoneNumberFrom: ${phoneNumberFrom}, callerId: ${callerId}`);

      let app_args = `sofia/gateway/sip_provider/${phoneNumberTo}`; //destinationNumber;
      let arg1 = `{ignore_early_media=true,origination_caller_id_number=${callerId}}${app_args}`;
      // let arg2 = `${arg1} &bridge(sofia/gateway/fs-test3/1000)`;
      let arg2 = `${arg1} &bridge(sofia/gateway/sip_provider/${phoneNumberFrom})`

      connection.execute('playback', 'ivr/ivr-recording_started.wav');

      let uid = null;

      connection.api('originate', arg2, function (res) {

        let callUid = res.getBody().toString().replace('+OK ', '');

        connection.execute(
          'playback',
          'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav',
          callUid
        );

        uid = callUid
        
        return callUid;
      });

      connection.execute('playback', 'ivr/ivr-recording_started.wav', uid);

      // connection.execute('set', '$${recordings_dir}/${strftime(%Y-%m-%d-%H-%M-%S)}_${destination_number}_${caller_id_number}.wav', uid);
    });
    return 'Error click to call';
  }
}
