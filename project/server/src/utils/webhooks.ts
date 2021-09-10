import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import { URIBuilder } from './uriBuilder';

require('dotenv').config();

const uriBuilder = new URIBuilder(process.env.BASE_URL);

export function WebhookInboundCallStatusCallBack(callData:CDRModel) {
    return uriBuilder.inboundCallStatusCallBack(callData)
}

export function WebhookOutboundCallStatusCallBack(callData:CDRModel){
    return uriBuilder.outboundCallStatusCallBack(callData);
}