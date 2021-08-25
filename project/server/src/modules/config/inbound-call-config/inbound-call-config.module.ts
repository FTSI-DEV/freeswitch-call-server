import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboundCallConfig, InboundCallConfigRepository } from 'src/entity/inboundCallConfig.entity';
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
