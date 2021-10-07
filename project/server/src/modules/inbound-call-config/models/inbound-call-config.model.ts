import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

export class InboundCallConfigModel{
    callerId: string;
    webhookUrl: string;
    httpMethod:string;
    id?: number;
    isDeleted:boolean;
}

export class InboundCallConfigParam{
    
    @IsDefined()
    @IsNotEmpty()
    callerId: string;

    @IsDefined()
    @IsNotEmpty()
    webhookUrl: string;

    @IsDefined()
    @IsNotEmpty()
    httpMethod:string;

    @IsOptional()
    id?:number;
}
