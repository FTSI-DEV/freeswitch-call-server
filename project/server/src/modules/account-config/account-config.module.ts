import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountConfigEntity, AccountConfigEntityRepository } from 'src/entity/account-config';
import { ACCOUNT_CONFIG_SERVICE } from './services/account-config.interface';
import { AccountConfigService } from './services/account-config.service';
import { AccountConfigController } from "./controllers/account-config.controller";

@Module({
    controllers: [AccountConfigController],
    providers: [
        {
            useClass: AccountConfigService,
            provide: ACCOUNT_CONFIG_SERVICE
        }
    ],
    imports: [TypeOrmModule.forFeature([AccountConfigEntity, AccountConfigEntityRepository])],
    exports: [ACCOUNT_CONFIG_SERVICE]
})
export class AccountConfigModule {}
