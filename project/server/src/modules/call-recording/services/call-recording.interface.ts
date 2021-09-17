import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { CallRecordingStorageEntity } from "src/entity/callRecordingStorage.entity";
import { CallRecordingStorageDTO } from "../models/call-recording.dto";
import { CallRecordingModel } from "../models/call-recording.model";

export const CALL_RECORDING_SERVICE = 'CALL RECORDING SERVICE';

export interface ICallRecordingService{
    saveCallRecording(param:CallRecordingModel);
    deleteCallRecording(recordingId:number):Promise<boolean>;
    getByRecordingId(recordingId:number):Promise<CallRecordingStorageEntity>;
    getByCallUid(callUid:string):Promise<CallRecordingStorageEntity>;
    getByRecordingUUID(recordingUid:string):Promise<CallRecordingStorageEntity>;
    getCallRecordings(options:IPaginationOptions):Promise<Pagination<CallRecordingStorageDTO>>;
}