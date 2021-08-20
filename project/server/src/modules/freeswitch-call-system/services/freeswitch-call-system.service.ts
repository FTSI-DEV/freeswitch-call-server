import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FsCallDetailRecordEntity, FsCallDetailRecordRepository } from 'src/entity/freeswitchCallDetailRecord.entity';
import { CDRModels } from 'src/models/cdr.models';

@Injectable()
export class FreeswitchCallSystemService {
    constructor(
        @InjectRepository(FsCallDetailRecordRepository)
        private freeswitchCallSystemRepo: FsCallDetailRecordRepository)
    {}

    async saveCDR(cdrParam: CDRModels, storeId: number){
        
        console.log('TRYING TO CREATE A RECORD');

        let cdr = await this.getById(cdrParam.Id);

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

    getById(id: number):Promise<FsCallDetailRecordEntity>{

        let retVal = null;

        let record = this.freeswitchCallSystemRepo.findOneOrFail(id)
            .then(result => {
                retVal = result;
            })
            .catch((err) => {
                retVal = null;
            });

        return retVal;
    }

    async getCallLogs(options: IPaginationOptions):Promise<Pagination<FsCallDetailRecordEntity>>{
        return paginate<FsCallDetailRecordEntity>(this.freeswitchCallSystemRepo, options);
    }
}
