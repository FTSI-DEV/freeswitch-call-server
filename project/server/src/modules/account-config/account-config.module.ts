import { MiddlewareConsumer, Module, NestModule, Req, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserAuthMiddleware } from 'src/auth/middlewares/user-auth.middleware';
import { AccountConfigEntity, AccountConfigEntityRepository } from 'src/entity/account-config.entity';
import { AccountConfigController } from './controllers/account-config.controller';
import { ACCOUNT_CONFIG_SERVICE } from './services/account-config.interface';
import { AccountConfigService } from './services/account-config.service';

@Module({
    controllers: [AccountConfigController],
    providers: [
        {
            useClass: AccountConfigService,
            provide: ACCOUNT_CONFIG_SERVICE
        }
    ],
    imports: [
        TypeOrmModule.forFeature([AccountConfigEntity, AccountConfigEntityRepository]),
        // AuthModule
    ],
    exports: [ACCOUNT_CONFIG_SERVICE],
})
export class AccountConfigModule {
    // public configure(consumer:MiddlewareConsumer){
    //     consumer
    //         .apply(UserAuthMiddleware)
    //         .forRoutes(
    //             { path: 'account-config/getAccountConfigById/:id', method: RequestMethod.GET},
    //             { path: 'account-config/getAccountConfigs', method: RequestMethod.GET },
    //             { path: 'account-config/add:/accountName' , method: RequestMethod.POST },
    //             { path: 'account-config/update', method: RequestMethod.POST },
    //             { path: 'account-config/delete', method: RequestMethod.POST}
    //         )
    // }
}
