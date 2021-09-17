import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FsCallDetailRecordEntity } from 'src/entity/call-detail-record';
import { CallRecordingStorageEntity, CallRecordingStorageRepository } from 'src/entity/callRecordingStorage.entity';
import { CALL_DETAIL_RECORD_SERVICE, ICallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.interface';
import { CallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.service';
import { CallRecordingStorageDTO } from '../models/call-recording.dto';
import { CallRecordingModel } from '../models/call-recording.model';
import { ICallRecordingService } from './call-recording.interface';

@Injectable()
export class CallRecordingService implements ICallRecordingService{

    constructor(
        @InjectRepository(CallRecordingStorageEntity)
        private _recordingStorageRepo : CallRecordingStorageRepository,
        @Inject(CALL_DETAIL_RECORD_SERVICE)
        private readonly _callRecordDetailService : ICallDetailRecordService
    ) {}
    
    async saveCallRecording(param: CallRecordingModel){

        let callRecording = new CallRecordingStorageEntity();

        callRecording.CallUid = param.CallUUID;
        callRecording.DateCreated = param.DateCreated;
        callRecording.FilePath = param.FilePath;
        callRecording.RecordingUid = param.CallUUID;

        let cdr = await this._callRecordDetailService.getById(param.CallId);

        if (cdr != null){
            callRecording.callDetailRecord = cdr;
        }

        await this._recordingStorageRepo.save(callRecording);
    }   

    async deleteCallRecording(recordingId:number):Promise<boolean>{

        let callRecording = await this.getByRecordingId(recordingId);

        if (callRecording != null){

            callRecording.IsDeleted = true;

            this._recordingStorageRepo.deleteRecord(callRecording);

            return true;
        }
        
        return false;
    }

    async getByRecordingId(recordingId:number):Promise<CallRecordingStorageEntity>{

        let record = await this._recordingStorageRepo
            .createQueryBuilder("CallRecordingStorage")
            .where("CallRecordingStorage.RecordingId = :recordingId", 
                   { 
                       recordingId: recordingId
                   })
            .getOne();

        return record;
    }

    async getByCallUid(callUid:string):Promise<CallRecordingStorageEntity>{
       
        let record = await this._recordingStorageRepo
            .createQueryBuilder("CallRecordingStorage")
            .where("CallRecordingStorage.CallUid = :callUid", 
                   { 
                    callUid: callUid
                   })
            .getOne();

        return record;
    }

    async getByRecordingUUID(recordingUid:string):Promise<CallRecordingStorageEntity>{
       
        let record = await this._recordingStorageRepo
            .createQueryBuilder("CallRecordingStorage")
            .where("CallRecordingStorage.RecordingUid = :recordingUid", 
                   { 
                    recordingUid: recordingUid
                   })
            .getOne();

        return record;
    }

    async getCallRecordings(options:IPaginationOptions):Promise<Pagination<CallRecordingStorageDTO>>{

        let pageRecords = await paginate<CallRecordingStorageEntity>(this._recordingStorageRepo, options);

        let itemObjs : CallRecordingStorageDTO[] = [];

        pageRecords.items.forEach(element => {
            let recordingDTO: CallRecordingStorageDTO = {
                RecordingId : element.RecordingId,
                RecordingUUID : element.RecordingUid,
                CallUUID : element.CallUid,
                FilePath : element.FilePath,
                IsDeleted: element.IsDeleted,
                DateCreated : element.DateCreated,
            };

            itemObjs.sort((n1,n2) => {
                return (n2.RecordingId < n1.RecordingId) ? -1 : 1;
            });

            itemObjs.push(recordingDTO);
        });

        return new Pagination<CallRecordingStorageDTO, IPaginationMeta>(itemObjs, pageRecords.meta);

        return new Promise<Pagination<CallRecordingStorageDTO>>((resolve,reject) => {

            let callRecordings = paginate<CallRecordingStorageEntity>(this._recordingStorageRepo, options);

            callRecordings
                .then(result => {
                    let itemObjs : CallRecordingStorageDTO[] = [];

                    result.items.forEach(element => {

                        let recordingDTO: CallRecordingStorageDTO = {
                            RecordingId : element.RecordingId,
                            RecordingUUID : element.RecordingUid,
                            CallUUID : element.CallUid,
                            FilePath : element.FilePath,
                            IsDeleted: element.IsDeleted,
                            DateCreated : element.DateCreated,
                            // CallId : element.callDetailRecord.Id
                        };

                        itemObjs.push(recordingDTO);
                    });

                    resolve(new Pagination<CallRecordingStorageDTO, IPaginationMeta>(itemObjs, result.meta));
                })
                .catch(err => {
                    reject(new Pagination<CallRecordingStorageDTO, IPaginationMeta> (null, {
                        itemCount: 0,
                        itemsPerPage: 0,
                        totalPages: 0,
                        totalItems: 0,
                        currentPage: 0
                    }));
                });
        });
    }
}
