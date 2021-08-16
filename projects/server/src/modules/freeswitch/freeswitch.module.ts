import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeswitchCallSystemEntity } from 'src/entity/freeswitchCallSystem.entity';
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
  imports: [TypeOrmModule.forFeature([FreeswitchCallSystemEntity])]
})
export class FreeswitchModule {}