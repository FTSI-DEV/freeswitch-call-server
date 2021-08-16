import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FreeswitchCallSystemEntity } from 'src/entity/freeswitchCallSystem.entity';
import { Vehicles } from 'src/entity/vehicles.entity';
import { CDRModels } from 'src/models/cdr.models';
import { createConnection, Repository } from 'typeorm';
import { IFreeswitchCallSystemService } from './freeswitch-call-system.interface';

@Injectable()
export class FreeswitchCallSystemService {
    constructor(
        @InjectRepository(FreeswitchCallSystemEntity)
        private freeswitchCallSystemRepo: Repository<FreeswitchCallSystemEntity>,
        @InjectRepository(Vehicles)
        private _vehicleRepo: Repository<Vehicles>)
    {}

    async createRecord(cdrParam: CDRModels, storeId: number) : Promise<FreeswitchCallSystemEntity>{
        
        console.log('TRYING TO CREATE A RECORD');

        let fs = new FreeswitchCallSystemEntity();

        console.log('CDRPARAM ' , cdrParam);

        fs.CallStatus = cdrParam.CallStatus;
        fs.PhoneNumberTo = cdrParam.CalleeIdNumber;
        fs.PhoneNumberFrom = cdrParam.CallerIdNumber;
        fs.DateCreated = cdrParam.StartedDate;
        fs.StoreId = storeId;
        fs.CallUUID = cdrParam.UUID;
        fs.Direction = cdrParam.CallDirection;
        fs.RecordingUUID = cdrParam.UUID;
        fs.Duration = cdrParam.Duration;

        console.log('FS2' , fs);

        await this.freeswitchCallSystemRepo.save(fs);

        return fs;

        // return null;
    }

    getByCallId(callUid:string): Promise<FreeswitchCallSystemEntity>{

        let result = this.freeswitchCallSystemRepo.find({
            where: {
                CallUUID: callUid
            }
        });

        let record = this.freeswitchCallSystemRepo.createQueryBuilder("FreeswitchCallSystem")
                    .where("FreeswitchCallSystem.CallUUID = :callUid", { callUid: callUid})
                    .getOne();

        console.log('RECORD' , record);

        return record;

    }

    getById(id: number):Promise<FreeswitchCallSystemEntity>{
        return this.freeswitchCallSystemRepo.findOneOrFail(id);
    }

    async getCallLogs(options: IPaginationOptions):Promise<Pagination<FreeswitchCallSystemEntity>>{
        return paginate<FreeswitchCallSystemEntity>(this.freeswitchCallSystemRepo, options);
    }
}
