import { Allow, IsBoolean, IsDate, IsDefined, IsEmpty, IsInt, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString } from "class-validator";


export class AccountConfigModel
{
    @IsOptional()
    id?:number; 

    @IsOptional()
    @IsString()
    accountSID?: string;

    @IsOptional()
    accountName?:string;

    @IsOptional()
    @IsString()
    authToken?:string;

    @IsOptional()
    dateCreated?:Date;

    @IsOptional()
    isActive?:boolean;
}
