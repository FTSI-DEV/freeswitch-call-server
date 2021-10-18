import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";
import { IvrOptionsCommandParam } from "./ivr-options-param.model";

export class InboundRulesConfigParamModel{

    @IsOptional()
    id?: number;

    @IsOptional()
    callerId? :string;

    @IsOptional()
    webhookUrl?:string;

    @IsOptional()
    httpMethod?:string;

    @IsOptional()
    isDeleted?:boolean;

    @IsDefined()
    @IsNotEmpty()
    accountId: number;

    @IsOptional()
    callTypeId?:number;

    @IsOptional()
    ivrOptions:IvrOptionsCommandParam;
}