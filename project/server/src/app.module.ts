import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { configService } from './config/config.service';
import { PhoneNumberConfigModule } from './modules/config/fs-phonenumber-config/phonenumber-config.module';
import { IvrModule } from './modules/ivr/ivr.module';
import { IncomingCallModule } from './modules/incomingCall/incomingCall.module';
import { FreeswitchCallSystemModule } from './modules/freeswitch-call-system/freeswitch-call-system.module';
import { FreeswitchModule } from './modules/freeswitch/freeswitch.module';
import { ClickToCallModule } from './modules/click-to-call/click-to-call.module';
import { InboundCallConfigModule } from './modules/config/inbound-call-config/inbound-call-config.module';
import { EslServerHelper } from './helpers/fs-esl/server';
import { StartFreeswitchApplication } from './helpers/fs-esl/event-socket-monitor';
import { InboundCallConfigService } from './modules/config/inbound-call-config/services/inbound-call-config.service';
import { CDRHelper } from './helpers/fs-esl/cdr.helper';
import { CustomLoggerModule } from './logger/logger.module';
// import { ClickToCallJobModule } from './beequeue/jobs/clickToCall/clickToCallJob.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    IvrModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    PhoneNumberConfigModule,
    IncomingCallModule,
    FreeswitchModule,
    FreeswitchCallSystemModule,
    ClickToCallModule,
    InboundCallConfigModule,
    ClickToCallModule,
    CustomLoggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection,
              private _inboundCall: InboundCallConfigService) {

    new EslServerHelper(_inboundCall, new CDRHelper()).startEslServer();

    // new StartFreeswitchApplication().startFS();

  }
}
