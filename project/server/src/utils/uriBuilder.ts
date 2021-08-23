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
    
    return `${this.baseUrl}/NewInboundCall/IncomingStatusCallBack?UUID=${callData.UUID}&&CallerIdNumber=${callData.CallerIdNumber}&&CallerName=${callData.CallerName}&&CalleeIdNumber=${callData.calleeIdNumber}&&CallDirection=${callData.CallDirection}&&CallStatus=${callData.CallStatus}&&Duration=${callData.Duration}&&StartedDate=${callData.StartedDate}&&StoreId=${callData.StoreId}`;
  }
}
