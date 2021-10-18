import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InboundRulesConfigEntity, InboundRulesConfigRepository } from 'src/entity/inbound-rules-config.entityt';
import { AccountConfigModule } from '../account-config/account-config.module';
import { InboundRulesConfigController } from './controllers/inbound-rules-config.controller';
import { InboundRulesConfigService } from './services/inbound-rules-config.service';
import { INBOUND_RULES_CONFIG_SERVICE } from './services/inbound-rules.config.interface';
@Module({
  controllers: [InboundRulesConfigController],
  providers: [
    {
      useClass: InboundRulesConfigService,
      provide: INBOUND_RULES_CONFIG_SERVICE
    }
  ],
  imports:[
    TypeOrmModule.forFeature([InboundRulesConfigEntity, InboundRulesConfigRepository]),
    AccountConfigModule,
    AuthModule
  ],
  exports: [INBOUND_RULES_CONFIG_SERVICE]
})
export class InboundRulesConfigModule {}
