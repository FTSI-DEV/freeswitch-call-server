import { CDRModel } from "src/modules/call-detail-record/models/cdr.models";

export class URIBuilder {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  inboundCallStatusCallBack(callData:CDRModel) {

    let api = `/api/inbound-call/incomingStatusCallback`;

    let params = this.mappedCallDataParams(callData);

    console.log('InboundCallData -> ', callData);

    console.log('MappedParams -> ', params);

    return `${this.baseUrl}${api}?${params}`;
  }

  outboundCallStatusCallBack(callData:CDRModel){

    let api = `/api/outbound-call/outboundCallStatusCallBack`;

    let params = this.mappedCallDataParams(callData);

    console.log('OutboundCallData -> ', callData);
    
    console.log('MappedParams -> ', params);

    return `${this.baseUrl}${api}?${params}`;
  }

  private mappedCallDataParams(callData:CDRModel):string{

    let callUUID = `UUID=${callData.UUID}`;
    let callerIdNumber = `PhoneNumberFrom=${callData.PhoneNumberFrom}`;
    let calleeIdNumber = `PhoneNumberTo=${callData.PhoneNumberTo}`;
    let callDirection = `CallDirection=${callData.CallDirection}`;
    let callStatus = `CallStatus=${callData.CallStatus}`;
    let startedDate = `StartedDate=${callData.StartedDate}`;
    let duration = `Duration=${callData.Duration}`;
    let recordingUUID = `RecordingUUID=${callData.RecordingUUID}`;
    let parentCallUUID = `ParentCallUid=${callData.ParentCallUid}`;
    let accountId = `AccountId=${callData.AccountId}`;

    return `${callUUID}&${callerIdNumber}&${calleeIdNumber}&${callDirection}&${callStatus}&${startedDate}&${duration}&${recordingUUID}&${parentCallUUID}&${accountId}`;
  }
}
