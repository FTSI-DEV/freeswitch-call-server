
export class URIBuilder {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  incomingStatusCallBack(callData) {

    let api = `/NewInboundCall/IncomingStatusCallBack`;

    let params = this.mappedCallDataParams(callData);

    return `${this.baseUrl}${api}?${params}`;
  }

  clickToCallStatusCallBack(callData){

    let api = `/api/freeswitch/clickToCallStatusCallback`;

    let params = this.mappedCallDataParams(callData);

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
    let parentCallUUID = `ParentCallUid=${callData.ParentCallUid}`;

    return `${callUUID}&${callerIdNumber}&${callerName}&${calleeIdNumber}&${callDirection}&${callStatus}&${startedDate}&${duration}&${recordingUUID}&${parentCallUUID}`;
  }
}
