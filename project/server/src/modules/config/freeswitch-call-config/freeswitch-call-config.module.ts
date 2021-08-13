import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeswitchCallConfig } from 'src/entity/freeswitchCallConfig.entity';
import { FreeswitchCallConfigController } from './controllers/freeswitch-call-config.controller';
import { FreeswitchCallConfigService } from './services/freeswitch-call-config.service';


@Module({
  providers: [FreeswitchCallConfigService],
  imports: [TypeOrmModule.forFeature([FreeswitchCallConfig])],
  exports: [FreeswitchCallConfigService, ],
  controllers: [FreeswitchCallConfigController]
})
export class FreeswitchCallConfigModule {}
