import { OriginateModel } from "src/helpers/fs-esl/models/originate.model";

export const FS_ESL_SERVICE = 'FS ESL SERVICE';

export interface IFSEslService{
    clickToCall(originateParam: OriginateModel);
}