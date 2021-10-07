import { IsDefined, IsEmpty, IsNotEmpty } from "class-validator";

export class AccountConfigModel
{
    @IsEmpty()
    id?:number;

    @IsEmpty()
    accountSID?: string;

    @IsDefined()
    @IsNotEmpty()
    accountName:string;

    @IsEmpty()
    authToken?:string;

    @IsEmpty()
    dateCreated?:Date;

    @IsEmpty()
    isActive?:boolean;
}