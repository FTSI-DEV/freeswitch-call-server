import { Injectable } from '@nestjs/common';
import { IIVRService } from './ivr.interface';

@Injectable()
export class IvrService implements IIVRService {

    public async greet(name:string):Promise<string>{
        return 'Hello world';
    }
}
