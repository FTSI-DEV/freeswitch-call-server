import { Injectable } from '@nestjs/common';
import { IGreetingService } from './greeting-service.interface';

@Injectable()
export class PersonalGreetingService implements IGreetingService {
    public async greet(name:string):Promise<string>{
        return `Hey, how's it goin' ${name}?`;
    }
}
