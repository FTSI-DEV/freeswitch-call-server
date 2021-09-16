import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FsCallDetailRecordEntity, FsCallDetailRecordRepository } from 'src/entity/call-detail-record';
import { CallDetailRecordDTO, CDRModel } from 'src/modules/call-detail-record/models/cdr.models';

@Injectable()
export class CallDetailRecordService {
    constructor(
        @InjectRepository(FsCallDetailRecordRepository)
        private _callDetailRecordRepo: FsCallDetailRecordRepository)
    {}

    async saveCDR(cdrParam: CDRModel):Promise<number>{

        let cdr = new FsCallDetailRecordEntity();

        console.log('STARTED DATE -> ', cdrParam.StartedDate);

        cdr.CallUid = cdrParam.UUID;
        cdr.CallStatus = cdrParam.CallStatus;
        cdr.RecordingUid = cdrParam.RecordingUUID;
        cdr.PhoneNumberFrom = cdrParam.PhoneNumberFrom;
        cdr.PhoneNumberTo = cdrParam.PhoneNumberTo;
        cdr.CallDuration = cdrParam.Duration;
        cdr.CallDirection = cdrParam.CallDirection;
        cdr.ParentCallUid = cdrParam.ParentCallUid;
        cdr.DateCreated = cdrParam.StartedDate;

        let record = await this._callDetailRecordRepo.saveCDR(cdr);

        return record.Id;
    }

    async updateCDR(cdrParam: CDRModel):Promise<number>{

        let result = await this.getByCallUid(cdrParam.UUID);

        if (result == null || result == undefined){
            console.log('result2 ', result);
        };

        console.log('CDR RECORD UPDATE -> ' , result);

        result.CallDuration = cdrParam.Duration;
        result.CallStatus = cdrParam.CallStatus;
        result.PhoneNumberFrom = cdrParam.PhoneNumberFrom;
        result.PhoneNumberTo = cdrParam.PhoneNumberTo;
        result.RecordingUid = cdrParam.UUID;
        result.ParentCallUid = cdrParam.ParentCallUid;

        let record = await this._callDetailRecordRepo.saveCDR(result);

        return record.Id
    }

    getByCallUid(callUid:string): Promise<FsCallDetailRecordEntity>{

        let record = this._callDetailRecordRepo.createQueryBuilder("CallDetailRecord")
                    .where("CallDetailRecord.CallUid = :callUid", { callUid: callUid})
                    .getOne();
        return record;
    }

    async getById(id: number): Promise<FsCallDetailRecordEntity>{

        let cdr = await this.getRecordById(id);

        return cdr;
    }

    getCallLogs(options: IPaginationOptions): any {

        return this.getCallConfigRecords(options);
    }

    private getCallConfigRecords(options: IPaginationOptions):Promise<any>{
        return new Promise<Pagination<CallDetailRecordDTO>>((resolve, reject) => {

            let pageRecords = paginate<FsCallDetailRecordEntity>(this._callDetailRecordRepo, options);

            pageRecords
            .then(result => {
                let itemObjs: CallDetailRecordDTO[] = [];

                result.items.forEach(element => {
                    let configModel: CallDetailRecordDTO = {
                        CallUUID: element.CallUid,
                        PhoneNumberFrom: element.PhoneNumberFrom,
                        PhoneNumberTo: element.PhoneNumberTo,
                        CallDirection: element.CallDirection,
                        CallStatus: element.CallStatus,
                        DateCreated: element.DateCreated,
                        Duration: element.CallDuration,
                        Id: element.Id,
                        RecordingUUID: element.RecordingUid,
                        ParentCallUid: element.ParentCallUid
                    };

                    itemObjs.push(configModel);
                });

                resolve(new Pagination<CallDetailRecordDTO, IPaginationMeta>(itemObjs, result.meta));
            })
            .catch(err => {
                reject(new Pagination<CallDetailRecordDTO, IPaginationMeta> (null, {
                    itemCount: 0,
                    itemsPerPage: 0,
                    totalPages: 0,
                    totalItems: 0,
                    currentPage: 0
                }));
            });

        })
        .catch(error => {
            console.log('Error', error);
        });
    }

    private getCDRById(id:number){

        return new Promise<CallDetailRecordDTO>((resolve,reject) => {

            this._callDetailRecordRepo.findOneOrFail(id)
            .then(result => {

                let cdrDTO: CallDetailRecordDTO = {
                    Id: result.Id,
                    PhoneNumberTo: result.PhoneNumberTo,
                    PhoneNumberFrom: result.PhoneNumberFrom,
                    CallStatus: result.CallStatus,
                    CallUUID: result.CallUid,
                    Duration: result.CallDuration,
                    DateCreated: result.DateCreated,
                    RecordingUUID: result.RecordingUid,
                    CallDirection: result.CallDirection,
                    ParentCallUid: result.ParentCallUid
                };

                console.log('resolving ', cdrDTO);
                resolve(cdrDTO);
            })
            .catch(err => {
                console.log('REJECT ', err);
                reject(null);
            });
        })
        .catch(err => {
            console.log('Error', err);
        });
    }

    private getRecordById = (id:number) : Promise<FsCallDetailRecordEntity> => {

        let record = this._callDetailRecordRepo.createQueryBuilder("CallDetailRecord")
        .where("CallDetailRecord.Id = :id", { id: id})
        .getOne();
        
        return record;
    } 
}
