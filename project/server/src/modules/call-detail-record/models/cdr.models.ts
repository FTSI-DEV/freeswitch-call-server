import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

export class CDRModel{

    @IsDefined()
    @IsNotEmpty()
    UUID: string;

    @IsOptional()
    PhoneNumberFrom?: string;

    @IsOptional()
    PhoneNumberTo?: string;

    @IsOptional()
    CallDirection?: string;

    @IsOptional()
    CallStatus?: string;

    @IsOptional()
    StartedDate: any;

    @IsOptional()
    Duration?: number;

    @IsOptional()
    Id?: number;
    RecordingUUID?: string;

    @IsOptional()
    ParentCallUid?:string;

    @IsOptional()
    AccountId?:number;
}

export class CallDetailRecordDTO{
    Id: number;
    PhoneNumberTo?: string;
    PhoneNumberFrom?: string;
    CallStatus?: string;
    CallUUID?: string;
    Duration?: number;
    DateCreated: Date;
    RecordingUUID?: string;
    CallDirection?: string;
    ParentCallUid?: string;
    AccountId?:number;
}