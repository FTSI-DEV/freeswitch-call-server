export class AccountConfigModel
{
    id?:number;
    accountSID?: string;
    accountName?:string;
    authToken?:string;
    dateCreated?:Date;
    isActive:boolean;
}