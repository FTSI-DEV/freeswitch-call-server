import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeswitchCallSystem } from 'src/entity/freeswitchCallSystem.entity';
import { Repository } from 'typeorm';
import { IFreeswitchService } from './freeswitch.interface';

@Injectable()
export class FreeswitchService implements IFreeswitchService{
    constructor(
        @InjectRepository(FreeswitchCallSystem)
        private readonly _freeswitchCallSystemRepo: Repository<FreeswitchCallSystem>
    ) {}

    test(){
        
    }
}
