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
import { CallDetailRecordModule } from './modules/call-detail-record/call-detail-record.module';
import { FreeswitchModule } from './modules/freeswitch/freeswitch.module';
import { InboundCallConfigModule } from './modules/config/inbound-call-config/inbound-call-config.module';
import { EslServerHelper } from './helpers/fs-esl/inboundCall.server';
import { InboundCallConfigService } from './modules/config/inbound-call-config/services/inbound-call-config.service';
import { BullModule } from '@nestjs/bull';
import { BullModuleQueue } from './bull-queue/bull.module';
import { TestModule } from './modules/test/test.module';
import { InboundEslConnectionHelper } from './helpers/fs-esl/inbound-esl.connection';
import { CallDetailRecordService } from './modules/call-detail-record/services/call-detail-record.service';
import { CallRecordingModule } from './modules/call-recording/call-recording.module';
import { OutboundCallModule } from './modules/outbound-call/outbound-call.module';
import { ClickToCallServerHelper } from './helpers/fs-esl/click-to-call.server';
import { OutboundCallService } from './modules/outbound-call/services/outbound-call.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    IvrModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    PhoneNumberConfigModule,
    IncomingCallModule,
    FreeswitchModule,
    CallDetailRecordModule,
    InboundCallConfigModule,
    BullModuleQueue,
    TestModule,
    BullModule.forRoot({
      redis:{
        host: process.env.REDIS_SERVER_HOST,
        port: 6379
      }
    }),
    CallRecordingModule,
    OutboundCallModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection,
              private readonly _inboundCall: InboundCallConfigService,
              private readonly _freeswitchCallSystem: CallDetailRecordService,
              private readonly _outboundCallService: OutboundCallService) {

    
    new EslServerHelper(_inboundCall).startEslServer();

    new InboundEslConnectionHelper().startConnection();

    new ClickToCallServerHelper(_outboundCallService).startClickToCallServer();
  }
}
