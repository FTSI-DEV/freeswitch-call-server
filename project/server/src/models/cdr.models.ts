export class CDRModels{
    UUID: string;
    CallerIdNumber: string;
    CallerName: string;
    CalleeIdNumber: string;
    CallDirection: string;
    CallStatus: string;
    StartedDate: any;
    Duration: any;
    Id?: number;
    RecordingUUID: string;
}

export class CallDetailRecordDTO{
    Id: number;
    PhoneNumberTo: string;
    PhoneNumberFrom: string;
    CallStatus: string;
    CallUUID: string;
    Duration: number;
    DateCreated: Date;
    StoreId: number;
    RecordingUUID: string;
    CallDirection: string;
}