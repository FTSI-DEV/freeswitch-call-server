import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeswitchCallConfig } from 'src/entity/freeswitchCallConfig.entity';
import { FreeswitchCallConfigService } from './freeswitch-call-config.service';

@Module({
  providers: [FreeswitchCallConfigService],
  imports: [TypeOrmModule.forFeature([FreeswitchCallConfig]), FreeswitchCallConfigService],
  exports: [FreeswitchCallConfigService]
})
export class FreeswitchCallConfigModule {}
