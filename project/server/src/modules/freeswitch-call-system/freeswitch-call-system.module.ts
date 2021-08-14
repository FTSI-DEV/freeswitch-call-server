import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeswitchCallSystem } from 'src/entity/freeswitchCallSystem.entity';
import { FREESWITCH_CALL } from './freeswitch-call-system.interface';
import { FreeswitchCallSystemService } from './freeswitch-call-system.service';

@Module({
  providers: [FreeswitchCallSystemService],
  imports: [TypeOrmModule.forFeature([FreeswitchCallSystem])],
  exports: [FreeswitchCallSystemService]
})
export class FreeswitchCallSystemModule {}

// @Module({
//   providers: [{
//     useClass : FreeswitchCallSystemService,
//     provide: FREESWITCH_CALL
//   }],
//   imports: [TypeOrmModule.forFeature([FreeswitchCallSystem])],
//   exports: [FreeswitchCallSystemService]
// })
// export class FreeswitchCallSystemModule {}