import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService,ConfigModule } from '@nestjs/config'

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    console.log('configService: ', configService.get('POSTGRES_HOST'));
    return {
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'my_database',
      entities: ['**/*.entity{.ts,.js}'],
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      cli: {
        migrationsDir: 'src/migration',
      },
      ssl: false,
    }
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
     imports: [ConfigModule],
     useFactory: async (configService: ConfigService):Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
     inject: [ConfigService]
} 