import { Module } from '@nestjs/common';
import { IvrController } from './ivr.controller';
import { IVR_SERVICE } from './ivr.interface';
import { IvrService } from './ivr.service';

@Module({
  controllers: [IvrController],
  providers: [{
    useClass : IvrService,
    provide: IVR_SERVICE
  }]
})
export class IvrModule {}
