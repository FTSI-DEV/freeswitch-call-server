import { IsDefined, IsEmpty, IsNotEmpty } from "class-validator";

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
  
    @IsEmpty()
    readonly isDeleted?: boolean

    @IsEmpty()
    readonly id? : number;
  }

export class PhoneNumberConfigModel{
    friendlyName: string;
    phoneNumber: string;
    httpMethod: string;
    webhookUrl: string;
}