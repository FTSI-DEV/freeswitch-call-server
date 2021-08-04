import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FsCredsModule } from 'src/fs-creds/fs-creds.module';
import { FsCredsService } from 'src/fs-creds/fs-creds.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersService, 
    FsCredsService,
    PassportModule, 
    UsersModule, 
    FsCredsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100s'}
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [UsersService,AuthService,FsCredsService]
})
export class AuthModule {}
