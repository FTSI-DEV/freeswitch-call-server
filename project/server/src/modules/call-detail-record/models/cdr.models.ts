export class CDRModel{
    UUID: string;
    PhoneNumberFrom?: string;
    PhoneNumberTo?: string;
    CallDirection?: string;
    CallStatus?: string;
    StartedDate: any;
    Duration?: number;
    Id?: number;
    RecordingUUID?: string;
    ParentCallUid?:string;
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