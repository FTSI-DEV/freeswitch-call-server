import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboundCallConfigEntity, InboundCallConfigRepository } from 'src/entity/inboundCallConfig.entity';
import { InboundCallConfigController } from './controllers/inbound-call-config.controller';
import { INBOUND_CALL_CONFIG_SERVICE } from './services/inbound-call-config.interface';
import { InboundCallConfigService } from './services/inbound-call-config.service';

@Module({
  providers: [{
    useClass: InboundCallConfigService,
    provide: INBOUND_CALL_CONFIG_SERVICE
  }],
  imports: [
    TypeOrmModule.forFeature([InboundCallConfigEntity, InboundCallConfigRepository])],
  controllers: [InboundCallConfigController],
  exports: [INBOUND_CALL_CONFIG_SERVICE]
})
export class InboundCallConfigModule {}
