import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserEntity, UserEntityRepository } from "src/entity/user.entity";

@ValidatorConstraint({ name : 'isUserAlreadyExist' , async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface{

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: UserEntityRepository
    ) {}

    async validate(Username:string):Promise<boolean>{

        let user = await this.userRepo.findOne({ Username });

        if (user === null || user === undefined){
            return false;
        }

        return true;
    }

    defaultMessage():string{
        return 'The username «$value» is already register.';
    }

}