import { FreeswitchCallSystem } from "src/entity/freeswitchCallSystem.entity";
import { CDRModels } from "src/models/cdr.models";


export const FREESWITCH_CALL = 'FREESWITCH CALL';

export interface IFreeswitchCallSystemService{
    createRecord(cdrParam: CDRModels, storeId: number): Promise<FreeswitchCallSystem>;
    getByCallId(callUid:string):Promise<FreeswitchCallSystem>;
    getById(id:number):Promise<FreeswitchCallSystem>;
}
