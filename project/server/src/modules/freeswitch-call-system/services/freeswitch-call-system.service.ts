import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FsCallDetailRecordEntity, FsCallDetailRecordRepository } from 'src/entity/freeswitchCallDetailRecord.entity';
import { CallDetailRecordDTO, CDRModels } from 'src/models/cdr.models';

@Injectable()
export class FreeswitchCallSystemService {
    constructor(
        @InjectRepository(FsCallDetailRecordRepository)
        private freeswitchCallSystemRepo: FsCallDetailRecordRepository)
    {}

    saveCDR(cdrParam: CDRModels){
        
        console.log('TRYING TO CREATE A RECORD');

        console.log('cdparam', cdrParam);

        let cdr = new FsCallDetailRecordEntity();

        cdr.CallUUID = cdrParam.UUID;
        cdr.CallStatus = cdrParam.CallStatus;
        cdr.DateCreated = cdrParam.StartedDate;
        cdr.RecordingUUID = cdrParam.RecordingUUID;
        cdr.PhoneNumberFrom = cdrParam.CallerIdNumber;
        cdr.PhoneNumberTo = cdrParam.CalleeIdNumber;
        cdr.CallDuration = cdrParam.CallDuration;
        cdr.CallDirection = cdrParam.CallDirection;
        cdr.ParentCallUid = cdrParam.ParentCallUid;

        this.freeswitchCallSystemRepo.saveCDR(cdr);

        console.log('fs', cdr);
    }

    async updateCDR(cdrParam: CDRModels){

        let result = await this.getByCallId(cdrParam.UUID);

        if (result == null || result == undefined){
            console.log('result2 ', result);
        };

        console.log('CDR RECORD UPDATE -> ' , result);

        result.CallDuration = cdrParam.CallDuration;
        result.CallStatus = cdrParam.CallStatus;
        result.PhoneNumberFrom = cdrParam.CallerIdNumber;
        result.PhoneNumberTo = cdrParam.CalleeIdNumber;
        result.RecordingUUID = cdrParam.UUID;
        result.ParentCallUid = cdrParam.ParentCallUid;

        await this.freeswitchCallSystemRepo.saveCDR(result);
    }

    getByCallId(callUid:string): Promise<FsCallDetailRecordEntity>{

        let record = this.freeswitchCallSystemRepo.createQueryBuilder("CallDetailRecord")
                    .where("CallDetailRecord.CallUUID = :callUid", { callUid: callUid})
                    .getOne();
        return record;
    }

    getById(id: number): any{
        return this.getCDRById(id);
    }

    getCallLogs(options: IPaginationOptions): any {

        return this.getCallConfigRecords(options);
    }

    private getCallConfigRecords(options: IPaginationOptions):Promise<any>{
        return new Promise<Pagination<CallDetailRecordDTO>>((resolve, reject) => {

            let pageRecords = paginate<FsCallDetailRecordEntity>(this.freeswitchCallSystemRepo, options);

            pageRecords
            .then(result => {
                let itemObjs: CallDetailRecordDTO[] = [];

                result.items.forEach(element => {
                    let configModel: CallDetailRecordDTO = {
                        CallUUID: element.CallUUID,
                        PhoneNumberFrom: element.PhoneNumberFrom,
                        PhoneNumberTo: element.PhoneNumberTo,
                        CallDirection: element.CallDirection,
                        CallStatus: element.CallStatus,
                        DateCreated: element.DateCreated,
                        Duration: element.CallDuration,
                        Id: element.id,
                        RecordingUUID: element.RecordingUUID,
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

    private getCDRById(id:number): any{

        return new Promise<CallDetailRecordDTO>((resolve,reject) => {

            this.freeswitchCallSystemRepo.findOneOrFail(id)
            .then(result => {

                let cdrDTO: CallDetailRecordDTO = {
                    Id: result.id,
                    PhoneNumberTo: result.PhoneNumberTo,
                    PhoneNumberFrom: result.PhoneNumberFrom,
                    CallStatus: result.CallStatus,
                    CallUUID: result.CallUUID,
                    Duration: result.CallDuration,
                    DateCreated: result.DateCreated,
                    RecordingUUID: result.RecordingUUID,
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
        return this.freeswitchCallSystemRepo.findOneOrFail(id);
    } 
}
