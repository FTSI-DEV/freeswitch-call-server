import { OriginationModel } from "src/helpers/fs-esl/models/originate.model";

export const GREETING_SERVICE = 'GREETING SERVICE';

export interface IFSEslService{
    clickToCall(phoneNumberTo: string, phoneNumberFrom: string, callerIdString:string):Promise<string>;
}