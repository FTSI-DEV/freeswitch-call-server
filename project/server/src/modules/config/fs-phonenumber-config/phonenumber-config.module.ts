import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeswitchCallConfig, FreeswitchCallConfigRepository } from 'src/entity/freeswitchCallConfig.entity';
import { FreeswitchPhoneNumberConfigController } from './controllers/phonenumber-config.controller';
import { FreeswitchPhoneNumberConfigService } from './services/phonenumber-config.service';


@Module({
  providers: [FreeswitchPhoneNumberConfigService],
  imports: [TypeOrmModule.forFeature([FreeswitchCallConfig, FreeswitchCallConfigRepository])],
  exports: [FreeswitchPhoneNumberConfigService, ],
  controllers: [FreeswitchPhoneNumberConfigController]
})
export class PhoneNumberConfigModule {}
