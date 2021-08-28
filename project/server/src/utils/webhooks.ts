import { URIBuilder } from './uriBuilder';

require('dotenv').config();

const uriBuilder = new URIBuilder(process.env.BASE_URL);

export function WebhookIncomingStatusCallBack(callData) {
    console.log('webhook entered -> ', callData);
    return uriBuilder.incomingStatusCallBack(callData)
}

//CLICK-TO-CALL STATUS CALLBACK
export function WebhookClickToCallStatusCallBack(callData){
    return uriBuilder.clickToCallStatusCallBack(callData);
}