import { IsOptional } from "class-validator";

export class IvrOptionsCommandParam{

    @IsOptional()
    ivrScript?:string;

    @IsOptional()
    welcomeMessage?:string;

    @IsOptional()
    welcomeRecordUrl?:string;

    @IsOptional()
    failedRetryMessage?:string;

    @IsOptional()
    failedMessage?:string;

    @IsOptional()
    redirectMessage?:string;

    @IsOptional()
    wrongInputRetryMessage?:string;

    @IsOptional()
    ivrRetryCount?:number;

    @IsOptional()
    preRedirectMessage?:string;

    @IsOptional()
    ivrOptions?:IvrOptionsParam[] = [];
}

export class IvrOptionsParam{

    @IsOptional()
    typeId?:number;

    @IsOptional()
    digitNumberInput?:number;

    @IsOptional()
    forwardingNumber?:string;
}