import { OriginationModel } from "src/helpers/fs-esl/models/originate.model";

export const FS_ESL_SERVICE = 'FS ESL SERVICE';

export interface IFSEslService{
    clickToCall(originateParam: OriginationModel);
    clickToCall2(phoneNumberTo: string, phoneNumberFrom: string):string;
}