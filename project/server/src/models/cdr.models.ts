export class CDRModels{
    UUID: string;
    CallerIdNumber?: string;
    CallerName?: string;
    CalleeIdNumber?: string;
    CallDirection?: string;
    CallStatus?: string;
    StartedDate: any;
    CallDuration?: any;
    Id?: number;
    RecordingUUID?: string;
}

export class CallDetailRecordDTO{
    Id: number;
    PhoneNumberTo: string;
    PhoneNumberFrom: string;
    CallStatus: string;
    CallUUID: string;
    Duration: number;
    DateCreated: Date;
    RecordingUUID: string;
    CallDirection: string;
}