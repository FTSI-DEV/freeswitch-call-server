import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { FsCallDetailRecordEntity } from "src/entity/call-detail-record";
import { CallDetailRecordDTO, CDRModel } from "src/modules/call-detail-record/models/cdr.models";


export const CALL_DETAIL_RECORD_SERVICE = 'CALL DETAIL RECORD SERVICE';

export interface ICallDetailRecordService{
    saveCDR(cdrParam:CDRModel):Promise<number>;
    updateCDR(cdrParam:CDRModel):Promise<number>;
    getByCallUid(callUid:string):Promise<FsCallDetailRecordEntity>;
    getById(id:number):Promise<FsCallDetailRecordEntity>;
    getCallLogs(options:IPaginationOptions):Promise<Pagination<CallDetailRecordDTO>>;
}
