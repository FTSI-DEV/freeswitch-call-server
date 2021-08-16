import { FreeswitchCallSystemEntity } from "src/entity/freeswitchCallSystem.entity";
import { CDRModels } from "src/models/cdr.models";


export const FREESWITCH_CALL = 'FREESWITCH CALL';

export interface IFreeswitchCallSystemService{
    createRecord(cdrParam: CDRModels, storeId: number): Promise<FreeswitchCallSystemEntity>;
    getByCallId(callUid:string):Promise<FreeswitchCallSystemEntity>;
    getById(id:number):Promise<FreeswitchCallSystemEntity>;
}
