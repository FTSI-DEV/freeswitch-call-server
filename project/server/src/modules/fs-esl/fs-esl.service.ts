import { HttpCode, Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { stringify } from 'querystring';
import { FS_ESL } from 'src/helpers/constants/fs-esl.constants';
import { CallDispatchHelper } from 'src/helpers/fs-esl/callDispatch.helper';
import { CDRHelper } from 'src/helpers/fs-esl/cdr.helper';
import { FreeswitchConnectionHelper } from 'src/helpers/fs-esl/eslfreeswitch.connection';
import { OriginationModel } from 'src/helpers/fs-esl/models/originate.model';
import { WebhookClickToCallStatusCallBack } from 'src/utils/webhooks';
import { IFSEslService } from './fs-esl.interface';
const http = require('http');
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
    let uid: string;

    this._fsConnection
      .connect()
      .then((connection) => {
        console.log('EXECUTING CLICK-TO-CALL');

        let app_args = `sofia/gateway/fs-test3/${phoneNumberTo}`;
        let arg1 = `{ignore_early_media=true,origination_caller_id_number=${callerId}}${app_args}`;
        let arg2 = `${arg1} &bridge(sofia/gateway/fs-test1/${phoneNumberFrom})`;

        connection.api('originate', arg2, function (res) {
          let callUid = res.getBody().toString().replace('+OK ', '');

          // connection.execute(
          //   'playback',
          //   'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav',
          //   callUid,
          // );

          uid = callUid;
        });

        let callrecord = null;

        connection.on(FS_ESL.RECEIVED, (fsEvent) => {
          const eventName = fsEvent.getHeader('Event-Name');

          console.log('LISTENING TO AN EVENT - CLICK-TO-CALL', eventName);

          if (eventName === 'CHANNEL_EXECUTE_COMPLETE'){

               let cdr =  new CDRHelper().getCallRecords(fsEvent);
                
              console.log('CDR CLICKTOCALL' , cdr);

                callrecord = cdr;
              }
        });

        connection.on('esl::end', function(evt,body) {

            //call webhook click-to-call status callback

            console.log('ESL ENDING');

            http.get(WebhookClickToCallStatusCallBack(callrecord), function(res){
              // console.log('ENTERED GET ', res);
            });
        })

        console.log('UID', uid);
      })
      .catch((err) => {
        let errMessage = 'Error click to call ' + err;

        console.log(errMessage);
        return errMessage;
      });

    return uid;
  }
}
