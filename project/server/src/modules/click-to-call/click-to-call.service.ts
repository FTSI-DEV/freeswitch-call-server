import { Injectable } from '@nestjs/common';
import { CHANNEL_VARIABLE } from 'src/helpers/constants/channel-variables.constants';
import { FS_ESL } from 'src/helpers/constants/fs-esl.constants';
import { CallDispatchHelper } from 'src/helpers/fs-esl/callDispatch.helper';
import { CDRHelper } from 'src/helpers/fs-esl/cdr.helper';
import { InboundEslConnectionHelper, FreeswitchConnectionResult } from 'src/helpers/fs-esl/inbound-esl.connection';
import { CDRModels } from 'src/models/cdr.models';
import { WebhookClickToCallStatusCallBack } from 'src/utils/webhooks';
import { IFSEslService } from './click-to-call.interface';

const http = require('http');

@Injectable()
export class FsEslService implements IFSEslService {
  constructor() {}

  private readonly _callDispatchHelper = new CallDispatchHelper();

  async clickToCall(
    phoneNumberTo: string,
    phoneNumberFrom: string,
    callerId: string,
  ): Promise<string> {

    let uid: string;
      let connectionResult = FreeswitchConnectionResult;

      if (!connectionResult.isSuccess){

        console.log('Connection Error -> No ESL Connection established');
        return "Connection Error -> No ESL Connection established";
      }

      uid = await this.triggerOriginateCall(
        connectionResult.connectionObj,
        phoneNumberFrom,
        phoneNumberTo,
        callerId,
      );

      console.log('UID', uid);

      return new Promise<string>((resolve,reject) => {
        resolve(uid);
      });
  }

  triggerOriginateCall(
    connection,
    phoneNumberFrom: string,
    phoneNumberTo: string,
    callerId: string,
  ): Promise<string> {

    return new Promise<any>((resolve,reject) => {

      let self = this;
    
      let app_args = `sofia/gateway/fs-test1/${phoneNumberFrom}`;
      let arg1 = `{ignore_early_media=true,origination_caller_id_number=${phoneNumberFrom},hangup_after_bridge=true}${app_args}`;
      let arg2 = `${arg1} &bridge({origination_caller_id_number=${callerId}}sofia/gateway/fs-test3/${phoneNumberTo})`;
      let arg3 = `bridge({hangup_after_bridge=true,origination_caller_id_number=${callerId}}sofia/gateway/fs-test3/${phoneNumberTo})`

      connection.api('originate', arg2, function(res){

        let callUid = res.getBody().toString().replace('+OK ', '');

        console.log('originate', callUid);

        resolve(callUid.trim());
      });
    });
  }

}
