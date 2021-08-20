import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FsCallDetailRecordRepository } from 'src/entity/freeswitchCallDetailRecord.entity';
import { Repository } from 'typeorm';
import { IFreeswitchService } from './freeswitch.interface';

@Injectable()
export class FreeswitchService implements IFreeswitchService{
    constructor(
        @InjectRepository(FsCallDetailRecordRepository)
        private readonly _freeswitchCallSystemRepo: FsCallDetailRecordRepository
    ) {}

    test(){
        
    }
}
