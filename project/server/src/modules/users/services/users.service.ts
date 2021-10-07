import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserEntityRepository } from 'src/entity/user.entity';
import { FindOneOptions } from 'typeorm';
import { UserUpdate } from '../dto/user-update.dto';
import { UserParamModel } from '../models/user-param.model';
import { IUserService } from './users.interface';

@Injectable()
export class UsersService implements IUserService{

    constructor(
        @InjectRepository(UserEntityRepository)
        private readonly userRepo : UserEntityRepository
    ){}

    async create(data: Partial<UserEntity>):Promise<UserEntity>{

       data.CreatedDate = new Date()

       return this.userRepo.saveRecord(new UserEntity(data));
    }

    async findOne(where: FindOneOptions<UserEntity>):Promise<UserEntity | undefined>{

        console.log('where -> ', where);
        
        let user = await this.userRepo.findOne(where);

        return user;
    }

    async update(id:number, updates: UserUpdate): Promise<UserEntity | undefined>{

        let user = await this.userRepo.findOne(id);

        Object.assign(user, updates);

        return this.userRepo.saveRecord(user);
    }

}
