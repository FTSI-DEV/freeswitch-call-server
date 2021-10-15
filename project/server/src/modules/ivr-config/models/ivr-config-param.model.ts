import { IsObject, IsOptional } from "class-validator";
import { IvrOptionsCommandParam } from "./ivr-options-param.model";

export class IvrConfigParam{

    @IsOptional()
    id?: number;

    @IsOptional()
    callerId?:string;

    @IsOptional()
    @IsObject()
    ivrOptions?:IvrOptionsCommandParam;

    @IsOptional()
    webhookUrl?:string;

    @IsOptional()
    isDeleted?:boolean;

    @IsOptional()
    accountId?:number;

    @IsOptional()
    httpMethod?:string;
}