import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { PhoneNumberConfigModule } from './modules/phonenumber-config/phonenumber-config.module';
import { IvrModule } from './modules/ivr/ivr.module';
import { IncomingCallModule } from './modules/incomingCall/incomingCall.module';
import { CallDetailRecordModule } from './modules/call-detail-record/call-detail-record.module';
import { EslServerHelper } from './helpers/fs-esl/inbound-call/inboundCall.server';
import { BullModule } from '@nestjs/bull';
import { BullModuleQueue } from './bull-queue/bull.module';
import { TestModule } from './modules/test/test.module';
import { InboundEslConnectionHelper } from './helpers/fs-esl/inbound-esl.connection';
import { CallRecordingModule } from './modules/call-recording/call-recording.module';
import { OutboundCallModule } from './modules/outbound-call/outbound-call.module';
import { OutboundCallService } from './modules/outbound-call/services/outbound-call.service';
import { GreetingModule } from './modules/greeting/greeting.module';
import { InboundCallConfigModule } from './modules/inbound-call-config/inbound-call-config.module';
import { IInboundCallConfigService, INBOUND_CALL_CONFIG_SERVICE } from './modules/inbound-call-config/services/inbound-call-config.interface';
import { OUTBOUND_CALL_SERVICE } from './modules/outbound-call/services/outbound-call.interface';
import { IIncomingCallService, INCOMING_CALL_SERVICE } from './modules/incomingCall/services/incomingCall.interface';
import { CALL_DETAIL_RECORD_SERVICE, ICallDetailRecordService } from './modules/call-detail-record/services/call-detail-record.interface';
import { CustomLoggerModule } from './logger/logger.module';
import { CUSTOM_LOGGER, ICustomAppLogger } from './logger/customLogger';
import { OutboundCallServerHelper } from './helpers/fs-esl/outbound-call/outbound-call.server';
import { AccountConfigModule } from './modules/account-config/account-config.module';
import { UsersModule } from './modules/users/users.module';
import redis from 'redis';
import { EslServerHelper2 } from './helpers/fs-esl/inbound-call2/inboundCall2.server';
// import { MiddleWaresModule } from './middlewares/middleware.module';

@Module({
  imports: [
    AuthModule,
    IvrModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    PhoneNumberConfigModule,
    IncomingCallModule,
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
    OutboundCallModule,
    GreetingModule,
    CustomLoggerModule,
    AccountConfigModule,
    UsersModule,
 ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(@Inject(INBOUND_CALL_CONFIG_SERVICE)
              private readonly _inboundCallConfigService: IInboundCallConfigService,
              @Inject(OUTBOUND_CALL_SERVICE)
              private readonly _outboundCallService: OutboundCallService,
              @Inject(INCOMING_CALL_SERVICE)
              private readonly _incomingCallService: IIncomingCallService,
              @Inject(CALL_DETAIL_RECORD_SERVICE)
              private readonly _callDetailRecordService: ICallDetailRecordService) {        

    new InboundEslConnectionHelper().startConnection();

    let client = redis.createClient(6379);

    client.on('connect', () => {
        console.log('Connected Redis Server!');
    });

    // new EslServerHelper(_inboundCallConfigService, client).startEslServer();

    new EslServerHelper2(_inboundCallConfigService, client).startEslServer();

    new OutboundCallServerHelper(_callDetailRecordService, client).startOutboundCallServer();
  }
}
