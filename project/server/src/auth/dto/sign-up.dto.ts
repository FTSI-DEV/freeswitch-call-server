import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUserAlreadyExist } from 'src/modules/users/user.validator';

export class SignUp {
  @IsDefined()
  @IsNotEmpty()
  readonly FirstName: string;

  @IsDefined()
  @IsNotEmpty()
  readonly LastName: string;

  @IsDefined()
  @Validate(IsUserAlreadyExist)
  readonly Username: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly Password: string;
}

