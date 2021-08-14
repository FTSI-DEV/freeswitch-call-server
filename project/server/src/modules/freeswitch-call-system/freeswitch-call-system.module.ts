import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeswitchCallSystemEntity } from 'src/entity/freeswitchCallSystem.entity';
import { Vehicles } from 'src/entity/vehicles.entity';
import { FREESWITCH_SERVICE } from '../freeswitch/freeswitch.interface';
import { FreeswitchCallSystemController } from './controllers/freeswitch-call-system.controller';
import { FreeswitchCallSystemService } from './services/freeswitch-call-system.service';

@Module({
  providers: [
    FreeswitchCallSystemService
  ],
  imports: [TypeOrmModule.forFeature([FreeswitchCallSystemEntity]),TypeOrmModule.forFeature([Vehicles])],
  exports: [FreeswitchCallSystemService],
  controllers: [FreeswitchCallSystemController]
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