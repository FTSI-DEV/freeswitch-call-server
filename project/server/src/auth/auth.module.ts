import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fscreds } from 'src/entity/freeswitch.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { FsCredsService } from './fs-creds.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([fscreds]),
    UsersService,
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100s'}
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [UsersService,AuthService]
})
export class AuthModule {}
