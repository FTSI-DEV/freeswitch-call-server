import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserEntityRepository } from 'src/entity/user.entity';
import { USER_SERVICE } from './services/users.interface';
import { UsersService } from './services/users.service';
import { IsUserAlreadyExist } from './user.validator';

@Module({
    providers: [
        {
            useClass: UsersService,
            provide: USER_SERVICE
        },
        IsUserAlreadyExist
    ],
    imports:[
        TypeOrmModule.forFeature([UserEntity, UserEntityRepository])
    ],
    exports: [USER_SERVICE]
})
export class UsersModule {}
