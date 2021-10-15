import { IvrOptionsCommandModel } from "./ivr-options.model";

export class IvrConfigModel{
    id?:number;
    callerId?:string;
    ivrOptions?:IvrOptionsCommandModel;
    webhookUrl?:string;
    isDeleted:boolean=false;
    createdDate?:Date;
    accountId?:number;
    httpMethod?:string;
}