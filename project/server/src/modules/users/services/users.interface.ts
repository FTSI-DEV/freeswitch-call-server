import { UserEntity } from "src/entity/user.entity";
import { FindOneOptions } from "typeorm";
import { UserUpdate } from "../dto/user-update.dto";

export const USER_SERVICE = 'USER_SERVICE';

export interface IUserService{

    create(data: Partial<UserEntity>):Promise<UserEntity>;
    findOne(where: FindOneOptions<UserEntity>):Promise<UserEntity | undefined>;
    update(id:number, updates: UserUpdate): Promise<UserEntity | undefined>;
}