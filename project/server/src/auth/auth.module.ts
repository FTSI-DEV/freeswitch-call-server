import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountConfigEntity, AccountConfigEntityRepository } from 'src/entity/account-config.entity';
import { UserAuthMiddleware } from 'src/auth/middlewares/user-auth.middleware';
import { AccountConfigModule } from 'src/modules/account-config/account-config.module';
// import { UserModule } from 'src/modules/user/user.module';
import { UsersModule } from 'src/modules/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

const APP_SECRET = '0dd8d1d7c673300e0e800e10e13eb6ee1414c140e046ebf7e2229010ab7ab79a10f06fddeebabfb428b6a380aa12654c';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: APP_SECRET,
      signOptions: {
        expiresIn: '1d',
        algorithm: 'HS384',
      },
      verifyOptions: {
        algorithms: ['HS384'],
      },
    }),
    // TypeOrmModule.forFeature([AccountConfigEntity, AccountConfigEntityRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, SessionSerializer],
  exports: [AuthService]
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware)
  }
}
