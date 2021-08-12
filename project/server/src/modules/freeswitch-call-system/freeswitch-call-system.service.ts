import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeswitchCallSystem } from 'src/entity/freeswitchCallSystem.entity';
import { CDRModels } from 'src/models/cdr.models';
import { Repository } from 'typeorm';

@Injectable()
export class FreeswitchCallSystemService {
    constructor(
        @InjectRepository(FreeswitchCallSystem)
        private freeswitchCallSystemRepo: Repository<FreeswitchCallSystem>) 
    {}

    async createRecord(cdrParam: CDRModels, storeId: number) : Promise<FreeswitchCallSystem>{
        
        let fs = new FreeswitchCallSystem();

        fs.CallStatus = cdrParam.CallStatus;
        fs.PhoneNumberTo = cdrParam.CalleeIdNumber;
        fs.PhoneNumberFrom = cdrParam.CallerIdNumber;
        fs.DateCreated = cdrParam.StartedDate;
        fs.StoreId = storeId;
        fs.CallUUID = cdrParam.UUID;
        fs.Direction = cdrParam.CallDirection;
        fs.RecordingUUID = cdrParam.UUID;
        fs.Duration = cdrParam.Duration;

        await this.freeswitchCallSystemRepo.save(fs);

        return fs;
    }

}
