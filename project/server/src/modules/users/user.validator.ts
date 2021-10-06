import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class IsUserAlreadyExist implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validate(Username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ Username });

    return isNullOrUndefined(user);
  }

  defaultMessage(): string {
    return 'The username «$value» is already register.';
  }
}
