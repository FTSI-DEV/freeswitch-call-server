import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalAccountStrategy } from './strategies/local-account.strategy';
import { AuthenticationController } from './auth.controller';
import { AccountConfigModule } from 'src/modules/account-config/account-config.module';
import { LocalUserStrategy } from './strategies/local-user.strategy';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d'}
    }),
    AccountConfigModule,
    UsersModule
  ],
  providers: [AuthService, LocalAccountStrategy, JwtStrategy, LocalUserStrategy],
  exports: [AuthService],
  controllers: [AuthenticationController]
})
export class AuthModule {}
