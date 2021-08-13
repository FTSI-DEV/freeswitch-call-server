import { Controller, Get, Inject } from '@nestjs/common';
import { IIVRService, IVR_SERVICE } from './ivr.interface';

@Controller('ivr')
export class IvrController {
    constructor(
        @Inject(IVR_SERVICE)
        private readonly _ivrService: IIVRService
    ) {}

    @Get()
    public async get():Promise<string>{
        return await this._ivrService.greet('Hello');
    }
}
