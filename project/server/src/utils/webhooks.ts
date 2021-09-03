import { CDRModels } from 'src/models/cdr.models';
import { URIBuilder } from './uriBuilder';

require('dotenv').config();

const uriBuilder = new URIBuilder(process.env.BASE_URL);

export function WebhookInboundCallStatusCallBack(callData:CDRModels) {
    return uriBuilder.inboundCallStatusCallBack(callData)
}

export function WebhookOutboundCallStatusCallBack(callData:CDRModels){
    return uriBuilder.outboundCallStatusCallBack(callData);
}