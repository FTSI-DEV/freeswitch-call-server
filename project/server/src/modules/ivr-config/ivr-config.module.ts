import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IvrConfigEntity, IvrConfigEntityRepository } from 'src/entity/ivr-config.entity';
import { AccountConfigModule } from '../account-config/account-config.module';
import { IvrConfigController } from './controllers/ivr-config.controller';
import { IVR_CONFIG_SERVICE } from './services/ivr-config.interface';
import { IvrConfigService } from './services/ivr-config.service';

@Module({
    providers : [
        {
            useClass: IvrConfigService,
            provide: IVR_CONFIG_SERVICE
        }
    ],
    imports : [
        TypeOrmModule.forFeature([IvrConfigEntity, IvrConfigEntityRepository]),
        AccountConfigModule
    ],
    controllers: [IvrConfigController],
    exports: [IVR_CONFIG_SERVICE]
})
export class IvrConfigModule {}
