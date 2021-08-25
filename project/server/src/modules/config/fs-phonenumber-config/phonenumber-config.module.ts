import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneNumberConfig, PhoneNumberConfigRepository } from 'src/entity/phoneNumberConfig.entity';
import { FreeswitchPhoneNumberConfigController } from './controllers/phonenumber-config.controller';
import { FreeswitchPhoneNumberConfigService } from './services/phonenumber-config.service';


@Module({
  providers: [FreeswitchPhoneNumberConfigService],
  imports: [
    TypeOrmModule.forFeature([PhoneNumberConfig, PhoneNumberConfigRepository])],
  exports: [FreeswitchPhoneNumberConfigService],
  controllers: [FreeswitchPhoneNumberConfigController]
})
export class PhoneNumberConfigModule {}
