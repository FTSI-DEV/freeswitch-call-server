import { URIBuilder } from './uriBuilder';

require('dotenv').config();

const uriBuilder = new URIBuilder(process.env.BASE_URL);

export function getIncomingCallEnterUri(StoreId, SystemId) {
   return uriBuilder.getIncomingCallEnterUri(StoreId, SystemId)
}

export function getIncomingCallVerify(StoreId, SystemId) {
    return uriBuilder.getIncomingCallVerifyUri(StoreId, SystemId)
}

export function getWaitingToConnect(StoreId, SystemId) {
    return uriBuilder.getWaitingToConnectUri(StoreId, SystemId)
}