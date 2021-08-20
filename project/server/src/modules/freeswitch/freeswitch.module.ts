import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FsCallDetailRecordEntity, FsCallDetailRecordRepository } from 'src/entity/freeswitchCallDetailRecord.entity';
import { FREESWITCH_SERVICE } from './freeswitch.interface';
import { FreeswitchService } from './freeswitch.service';

// @Module({
//   providers: [{
//     useClass: FreeswitchService,
//     useValue: FREESWITCH_SERVICE
//   }],
//   imports: [TypeOrmModule.forFeature([FreeswitchCallSystem])]
// })
// export class FreeswitchModule {}


@Module({
  providers: [{
    useClass : FreeswitchService,
    provide: FREESWITCH_SERVICE
  }],
  imports: [TypeOrmModule.forFeature([FsCallDetailRecordEntity,FsCallDetailRecordRepository])]
})
export class FreeswitchModule {}