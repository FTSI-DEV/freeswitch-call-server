import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboundCallConfigEntity, InboundCallConfigRepository } from 'src/entity/inboundCallConfig.entity';
import { InboundCallConfigController } from './controllers/inbound-call-config.controller';
import { InboundCallConfigService } from './services/inbound-call-config.service';

@Module({
  providers: [InboundCallConfigService],
  imports: [
    TypeOrmModule.forFeature([InboundCallConfigEntity, InboundCallConfigRepository])],
  controllers: [InboundCallConfigController],
  exports: [InboundCallConfigService]
})
export class InboundCallConfigModule {}
