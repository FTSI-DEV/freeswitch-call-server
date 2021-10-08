import { IsDefined, IsNotEmpty } from "class-validator";

export class AccountConfigDTO{
    id:number;
    accountSID:string;
    accountName:string;
    authKey:string;
    dateCreated:Date;
    isActive:boolean;
}

export class AccountCredentialModel{

    @IsDefined()
    @IsNotEmpty()
    AccountSID:string;
    
    @IsDefined()
    @IsNotEmpty()
    AuthKey:string;
}