import { HttpCode, Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { stringify } from 'querystring';
import { redisOptions } from 'src/beequeue/config/redisOptions.config';
import { CHANNEL_VARIABLE } from 'src/helpers/constants/channel-variables.constants';
import { FS_ESL } from 'src/helpers/constants/fs-esl.constants';
import { CallDispatchHelper } from 'src/helpers/fs-esl/callDispatch.helper';
import { CDRHelper } from 'src/helpers/fs-esl/cdr.helper';
import { FreeswitchConnectionHelper } from 'src/helpers/fs-esl/eslfreeswitch.connection';
import { OriginationModel } from 'src/helpers/fs-esl/models/originate.model';
import { CDRModels } from 'src/models/cdr.models';
import { WebhookClickToCallStatusCallBack } from 'src/utils/webhooks';
import { IFSEslService } from './click-to-call.interface';
const http = require('http');

const BeeQueue = require('bee-queue');
const jobQueue = new BeeQueue('default', redisOptions);

@Injectable()
export class FsEslService implements IFSEslService {
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

        uid = this.triggerOriginateCall(
          connection,
          phoneNumberFrom,
          phoneNumberTo,
          callerId,
        );

        // this._onListenEvent(connection, uid);

        console.log('UID', uid);
      })
      .catch((err) => {
        let errMessage = 'Error click to call ' + err;
        console.log(errMessage);
        return errMessage;
      });

    return uid;
  }

  private triggerOriginateCall(
    connection,
    phoneNumberFrom: string,
    phoneNumberTo: string,
    callerId: string,
  ): string {
    let self = this;
    let callUid: string = '';

    let app_args = `sofia/gateway/fs-test1/${phoneNumberFrom}`;
    let arg1 = `{ignore_early_media=true,origination_caller_id_number=${callerId}}${app_args}`;
    let arg2 = `${arg1} &bridge({origination_caller_id_number=${callerId}}sofia/gateway/fs-test3/${phoneNumberTo})`;

    // let app_args = `sofia/gateway/sip_provider/${phoneNumberTo}`;
    // let arg1 = `{ignore_early_media=true,origination_caller_id_number=${callerId}}${app_args}`;
    // let arg2 = `${arg1} &bridge(sofia/gateway/sip_provider/${phoneNumberFrom})`;

    connection.api('originate', arg2, function (res) {
      callUid = res.getBody().toString().replace('+OK ', '');

      console.log('callUid -> ', callUid);

      self._onListenEvent(connection, callUid);
    });

    console.log('sss', callUid);

    return callUid;
  }

  private _onListenEvent(connection, uuid: string) {
    console.log('uid2 -> ', uuid);

    let self = this;

    connection.subscribe('all');

    connection.on(FS_ESL.RECEIVED, (fsEvent) => {
      const eventName = fsEvent.getHeader('Event-Name');

      const callUids = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);
      console.log('originate uid - >', callUids);
      // console.log('testtest', uid);
      if (callUids === uuid.trim()) {
       console.log('LISTENING TO AN EVENT - CLICK-TO-CALL', eventName);
        if (eventName === 'CHANNEL_HANGUP_COMPLETE') {
          console.log('LISTENING TO AN EVENT ', eventName);
          let cdrModel = new CDRHelper().getCallRecords(fsEvent);

          console.log('CDR CLICKTOCALL', cdrModel);

          self.triggerClickToCallStatusCallBack(cdrModel);
        }
      }
    });
  }

  private _onListenEslEnd(connection, callrecord) {
    connection.on('esl::end', function (evt, body) {
      //call webhook click-to-call status callback

      console.log('ESL ENDING');

      http.get(WebhookClickToCallStatusCallBack(callrecord), function (res) {
        // console.log('ENTERED GET ', res);
      });
    });
  }

  private triggerClickToCallStatusCallBack(cdrModel: CDRModels) {
    http.get(WebhookClickToCallStatusCallBack(cdrModel));
  }
}
