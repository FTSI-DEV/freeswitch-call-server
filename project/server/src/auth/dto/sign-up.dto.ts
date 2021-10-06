import { IsDefined, IsNotEmpty, MinLength, Validate } from "class-validator";
import { IsUserAlreadyExist } from "src/modules/users/user.validator";

export class SignUp{

    @IsDefined()
    @IsNotEmpty()
    readonly FirstName:string;

    @IsDefined()
    @IsNotEmpty()
    readonly LastName:string;

    @IsDefined()
    @IsNotEmpty()
    @Validate(IsUserAlreadyExist)
    readonly Username:string;

    @IsDefined()
    @IsNotEmpty()
    @MinLength(7)
    readonly Password: string;
}