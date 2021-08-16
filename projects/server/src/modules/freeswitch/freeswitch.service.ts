import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeswitchCallSystemEntity } from 'src/entity/freeswitchCallSystem.entity';
import { Repository } from 'typeorm';
import { IFreeswitchService } from './freeswitch.interface';

@Injectable()
export class FreeswitchService implements IFreeswitchService{
    constructor(
        @InjectRepository(FreeswitchCallSystemEntity)
        private readonly _freeswitchCallSystemRepo: Repository<FreeswitchCallSystemEntity>
    ) {}

    test(){
        
    }
}
