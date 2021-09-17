import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneNumberConfigEntity, PhoneNumberConfigRepository } from 'src/entity/phoneNumberConfig.entity';
import { FreeswitchPhoneNumberConfigController as PhoneNumberConfigController } from './controllers/phonenumber-config.controller';
import { PHONENUMBER_CONFIG_SERVICE } from './services/iphonenumber-config.interface';
import { PhoneNumberConfigService } from './services/phonenumber-config.service';


@Module({
  providers: [{
    useClass: PhoneNumberConfigService,
    provide: PHONENUMBER_CONFIG_SERVICE
  }],
  imports: [
    TypeOrmModule.forFeature([PhoneNumberConfigEntity, PhoneNumberConfigRepository])],
  exports: [PHONENUMBER_CONFIG_SERVICE],
  controllers: [PhoneNumberConfigController]
})
export class PhoneNumberConfigModule {}
