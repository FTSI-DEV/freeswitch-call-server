export const OUTBOUND_CALL_SERVICE = 'OUTBOUND_CALL_SERVICE';

export interface IOutboundCallService{
    clickToCall(
        phoneNumberTo:string,
        phoneNumberFrom: string,
        callerId: string
    ):Promise<string>;
}