import { ReturningStatementNotSupportedError } from "typeorm";

export class URIBuilder {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  incomingStatusCallBack(callData) {
    console.log('STATUSCALLBACKDATA - trying to trigger ', callData);

    let api = `/NewInboundCall/IncomingStatusCallBack`;

    let params = this.mappedCallDataParams(callData);

    return `${this.baseUrl}${api}?${params}`;
  }

  clickToCallStatusCallBack(callData){
    console.log('trying to trigger webhoook api', callData);

    let api = `/api/freeswitch/clickToCallStatusCallback`;

    let params = this.mappedCallDataParams(callData);

    console.log(`url -> ${this.baseUrl}${api}?&${params}`);

    return `${this.baseUrl}${api}?${params}`;
  }

  private mappedCallDataParams(callData):string{

    let callUUID = `UUID=${callData.UUID}`;
    let callerIdNumber = `CallerIdNumber=${callData.CallerIdNumber}`;
    let callerName = `CallerName=${callData.CallerName}`;
    let calleeIdNumber = `CalleeIdNumber=${callData.CalleeIdNumber}`;
    let callDirection = `CallDirection=${callData.CallDirection}`;
    let callStatus = `CallStatus=${callData.CallStatus}`;
    let startedDate = `StartedDate=${callData.StartedDate}`;
    let duration = `Duration=${callData.CallDuration}`;
    let recordingUUID = `RecordingUUID=${callData.RecordingUUID}`;

    return `${callUUID}&${callerIdNumber}&${callerName}&${calleeIdNumber}&${callDirection}&${callStatus}&${startedDate}&${duration}&${recordingUUID}`;
  }
}
