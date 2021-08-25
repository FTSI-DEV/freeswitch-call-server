import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeswitchCallConfig, FreeswitchCallConfigRepository } from 'src/entity/freeswitchCallConfig.entity';
import { InboundCallConfig, InboundCallConfigRepository } from 'src/entity/inboundCallConfig.entity';
import { PhoneNumberConfigModule } from '../fs-phonenumber-config/phonenumber-config.module';
import { FreeswitchPhoneNumberConfigService } from '../fs-phonenumber-config/services/phonenumber-config.service';
import { InboundCallConfigController } from './controllers/inbound-call-config.controller';
import { InboundCallConfigService } from './services/inbound-call-config.service';

@Module({
  providers: [InboundCallConfigService],
  imports: [
    TypeOrmModule.forFeature([InboundCallConfig, InboundCallConfigRepository])],
  controllers: [InboundCallConfigController],
  exports: [InboundCallConfigService]
})
export class InboundCallConfigModule {}
