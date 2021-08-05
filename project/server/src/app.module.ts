import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { configService } from './services/config/config.service';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forRoot(configService.getTypeOrmConfig())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection){}
 } 
 
