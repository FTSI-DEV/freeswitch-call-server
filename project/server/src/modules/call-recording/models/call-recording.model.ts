export class CallRecordingModel{
    RecordingId: number;
    RecordingUUID?: string;
    CallUUID?: string;
    FilePath?:string;
    IsDeleted:boolean;
    DateCreated:Date;
    CallId?: number;
}