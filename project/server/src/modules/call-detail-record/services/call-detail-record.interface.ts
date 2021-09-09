import { FsCallDetailRecordEntity } from "src/entity/freeswitchCallDetailRecord.entity";
import { CDRModels } from "src/models/cdr.models";


export const FREESWITCH_CALL = 'FREESWITCH CALL';

export interface ICallDetailRecordService{
    createRecord(cdrParam: CDRModels, storeId: number): Promise<FsCallDetailRecordEntity>;
    getByCallId(callUid:string):Promise<FsCallDetailRecordEntity>;
    getById(id:number):Promise<FsCallDetailRecordEntity>;
}
