import { Module } from '@nestjs/common';
import { IvrController } from './ivr.controller';
import { IvrService } from './ivr.service';

@Module({
  controllers: [IvrController],
  providers: [IvrService]
})
export class IvrModule {}
