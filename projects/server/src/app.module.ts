import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { configService } from './config/config.service';
import { FreeswitchCallConfigModule } from './modules/config/freeswitch-call-config/freeswitch-call-config.module';
import { IvrModule } from './modules/ivr/ivr.module';
import { IncomingCallModule } from './modules/incomingCall/incomingCall.module';
import { FreeswitchCallSystemModule } from './modules/freeswitch-call-system/freeswitch-call-system.module';
import { FreeswitchModule } from './modules/freeswitch/freeswitch.module';

@Module({
  imports: [AuthModule, 
            UsersModule, 
            IvrModule,
            TypeOrmModule.forRoot(configService.getTypeOrmConfig()), 
            FreeswitchCallConfigModule,
            IncomingCallModule,
            FreeswitchModule,
            FreeswitchCallSystemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection){}
 } 
 
