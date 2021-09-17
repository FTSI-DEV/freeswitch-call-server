import { CDRModel } from "src/modules/call-detail-record/models/cdr.models";

export const INCOMING_CALL_SERVICE = 'INCOMING_CALL_SERVICE';

export interface IIncomingCallService{
    saveIncomingCallCDR(callData:CDRModel)
}