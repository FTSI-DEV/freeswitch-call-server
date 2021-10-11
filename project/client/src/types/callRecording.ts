export interface CallRecordingItem {
    RecordingId: number;
    RecordingUUID?: string;
    CallUUID?: string;
    FilePath?:string;
    IsDeleted:boolean;
    DateCreated:Date;
    CallId?: number;
    Duration: string;
}

export interface RecordingDetail {
    CallUUID: string;
    DateCreated: string;
    FilePath: string;
    IsDeleted: boolean;
    RecordingId: number;
    RecordingUUID: string;
}

export interface CallRecordingPager {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface CallRecording {
    Data: {
        items: Array<CallRecordingItem>,
        meta: CallRecordingPager
        detail: RecordingDetail
    }
}