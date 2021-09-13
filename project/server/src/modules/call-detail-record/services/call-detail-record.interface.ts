import { FsCallDetailRecordEntity } from "src/entity/call-detail-record";
import { CDRModel } from "src/modules/call-detail-record/models/cdr.models";


export const FREESWITCH_CALL = 'FREESWITCH CALL';

export interface ICallDetailRecordService{
    createRecord(cdrParam: CDRModel, storeId: number): Promise<FsCallDetailRecordEntity>;
    getByCallId(callUid:string):Promise<FsCallDetailRecordEntity>;
    getById(id:number):Promise<FsCallDetailRecordEntity>;
}
