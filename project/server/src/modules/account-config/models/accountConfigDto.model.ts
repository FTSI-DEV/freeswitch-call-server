export class AccountConfigDTO{
    id:number;
    accountSID:string;
    accountName:string;
    authKey:string;
    dateCreated:Date;
    isActive:boolean;
}

export class AccountCredentialModel{
    accountSID:string;
    authKey:string;
}