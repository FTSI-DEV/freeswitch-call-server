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
    }
}