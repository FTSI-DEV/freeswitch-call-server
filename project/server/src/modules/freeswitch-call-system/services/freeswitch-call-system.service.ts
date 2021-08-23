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

    saveCDR(cdrParam: CDRModels, storeId: number){
        
        console.log('TRYING TO CREATE A RECORD');

        console.log('cdparam', cdrParam);

        let cdr = this.getById(cdrParam.Id);

        console.log('EXISTING CDR', cdr);

        if (cdr == null){

            cdr = new FsCallDetailRecordEntity();

            cdr.CallUUID = cdrParam.UUID;
        }

        cdr.CallStatus = cdrParam.CallStatus;
        cdr.DateCreated = cdrParam.StartedDate;
        cdr.StoreId = storeId;
        cdr.RecordingUUID = cdrParam.RecordingUUID;
        cdr.PhoneNumberFrom = cdrParam.CallerIdNumber;
        cdr.PhoneNumberTo = cdrParam.CalleeIdNumber;
        cdr.Duration = cdrParam.Duration;
        cdr.Direction = cdrParam.Duration;

        this.freeswitchCallSystemRepo.saveCDR(cdr);
    }

    getByCallId(callUid:string): Promise<FsCallDetailRecordEntity>{

        let record = this.freeswitchCallSystemRepo.createQueryBuilder("CallDetailRecord")
                    .where("CallDetailRecord.CallUUID = :callUid", { callUid: callUid})
                    .getOne();

        console.log('RECORD' , record);

        return record;
    }

    getById(id: number): any{
        return this.getCDRById(id);
    }

    private getCDRById(id:number): Promise<any>{

        return new Promise<CallDetailRecordDTO>((resolve,reject) => {

            let record = this.freeswitchCallSystemRepo.findOneOrFail(id)
            .then(result => {

                let cdrDTO: CallDetailRecordDTO = {
                    Id: result.id,
                    PhoneNumberTo: result.PhoneNumberTo,
                    PhoneNumberFrom: result.PhoneNumberFrom,
                    CallStatus: result.CallStatus,
                    CallUUID: result.CallUUID,
                    Duration: result.Duration,
                    DateCreated: result.DateCreated,
                    StoreId: result.StoreId,
                    RecordingUUID: result.RecordingUUID,
                    CallDirection: result.Direction
                };

                resolve(cdrDTO);
            })
            .catch(err => {
                reject(null);
            });
        })
        .catch(err => {
            console.log('Error', err);
        });
    }

    async getCallLogs2(options: IPaginationOptions):Promise<Pagination<FsCallDetailRecordEntity>>{
        return paginate<FsCallDetailRecordEntity>(this.freeswitchCallSystemRepo, options);
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
                        CallDirection: element.Direction,
                        CallStatus: element.CallStatus,
                        DateCreated: element.DateCreated,
                        Duration: element.Duration,
                        StoreId: element.StoreId,
                        Id: element.id,
                        RecordingUUID: element.RecordingUUID
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
}
