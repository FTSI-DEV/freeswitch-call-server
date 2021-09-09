import { CDRModels } from "src/models/cdr.models";

export class URIBuilder {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  inboundCallStatusCallBack(callData:CDRModels) {

    let api = `/NewInboundCall/IncomingStatusCallBack`;

    let params = this.mappedCallDataParams(callData);

    return `${this.baseUrl}${api}?${params}`;
  }

  outboundCallStatusCallBack(callData:CDRModels){

    let api = `/api/outbound-call/outboundCallStatusCallBack`;

    let params = this.mappedCallDataParams(callData);

    return `${this.baseUrl}${api}?${params}`;
  }

  private mappedCallDataParams(callData:CDRModels):string{

    let callUUID = `UUID=${callData.UUID}`;
    let callerIdNumber = `PhoneNumberFrom=${callData.PhoneNumberFrom}`;
    let calleeIdNumber = `PhoneNumberTo=${callData.PhoneNumberTo}`;
    let callDirection = `CallDirection=${callData.CallDirection}`;
    let callStatus = `CallStatus=${callData.CallStatus}`;
    let startedDate = `StartedDate=${callData.StartedDate}`;
    let duration = `Duration=${callData.CallDuration}`;
    let recordingUUID = `RecordingUUID=${callData.RecordingUUID}`;
    let parentCallUUID = `ParentCallUid=${callData.ParentCallUid}`;

    return `${callUUID}&${callerIdNumber}&${calleeIdNumber}&${callDirection}&${callStatus}&${startedDate}&${duration}&${recordingUUID}&${parentCallUUID}`;
  }
}
