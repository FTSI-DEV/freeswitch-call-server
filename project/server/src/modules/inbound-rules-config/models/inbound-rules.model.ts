import { IvrOptionsCommandModel } from "./ivr-options.model";

export class InboundRulesConfigModel{

    id?:number;

    webhookUrl:string;

    httpMethod:string;

    isDeleted:boolean;

    accountId: number;

    createdDate?:Date;

    updatedDate?:Date;

    callTypeId?:number;

    callerId? :string;

    ivrOptions?:IvrOptionsCommandModel;
}