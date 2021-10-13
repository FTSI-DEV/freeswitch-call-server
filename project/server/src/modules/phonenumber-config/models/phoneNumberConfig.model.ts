import { IsDefined, IsEmpty, IsNotEmpty, IsOptional } from "class-validator";

export class PhoneNumberConfigParam{
    @IsDefined()
    @IsNotEmpty()
    readonly friendlyName:string;
  
    @IsDefined()
    @IsNotEmpty()
    readonly phoneNumber: string;
  
    @IsDefined()
    @IsNotEmpty()
    readonly httpMethod: string;
  
    @IsDefined()
    @IsNotEmpty()
    readonly webhookUrl: string;
  
    @IsOptional()
    readonly isDeleted?: boolean

    @IsOptional()
    readonly id? : number;

    @IsDefined()
    @IsNotEmpty()
    readonly accountId: number;
  }

export class PhoneNumberConfigModel{
    friendlyName: string;
    phoneNumber: string;
    httpMethod: string;
    webhookUrl: string;
    accountId: number;
}