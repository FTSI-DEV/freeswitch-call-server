export class URIBuilder {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getIncomingCallEnterUri(StoreId, SystemId) {
    return `${this.baseUrl}/NewInboundCall/IncomingCallEnter?StoreId=${StoreId}&SystemId=${SystemId}`;
  }
  getIncomingCallVerifyUri(StoreId, SystemId) {
    return `${this.baseUrl}/NewInboundCall/IncomingCallVerify?StoreId=${StoreId}&SystemId=${SystemId}`;
  }
  getWaitingToConnectUri(StoreId, SystemId) {
    return `${this.baseUrl}/NewInboundCall/WaitingToConnect?StoreId=${StoreId}&SystemId=${SystemId}`;
  }
  incomingStatusCallBack(callData) {
    console.log('STATUSCALLBACKDATA - trying to trigger ', callData);
    
    console.log('calleeid number: ', callData.CalleeIdNumber);
    return `${this.baseUrl}/NewInboundCall/IncomingStatusCallBack?UUID=${callData.UUID}&CallerIdNumber=${callData.CallerIdNumber}&CallerName=${callData.CallerName}&CallDirection=${callData.CallDirection}&CallStatus=${callData.CallStatus}&Duration=${callData.Duration}&StartedDate=${callData.StartedDate}&StoreId=60&CalleeIdNumber=${callData.CalleeIdNumber}`;
  }
  clickToCallStatusCallBack(callData){
    console.log('trying to trigger webhoook api', callData);
    
    return `${this.baseUrl}/freeswitch/clickToCallStatusCallback?UUID=${callData}`;
  }
}
