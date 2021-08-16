import { URIBuilder } from './uriBuilder';

require('dotenv').config();

const uriBuilder = new URIBuilder(process.env.BASE_URL);

export function WebhookGetIncomingCallEnterUri(StoreId, SystemId) {
   return uriBuilder.getIncomingCallEnterUri(StoreId, SystemId)
}

export function WebhookGetIncomingCallVerify(StoreId, SystemId) {
    return uriBuilder.getIncomingCallVerifyUri(StoreId, SystemId)
}

export function WebhookGetWaitingToConnect(StoreId, SystemId) {
    return uriBuilder.getWaitingToConnectUri(StoreId, SystemId)
}

export function WebhookIncomingStatusCallBack(callData) {
    console.log('webhook entered -> ', callData);
    return uriBuilder.incomingStatusCallBack(callData)
}