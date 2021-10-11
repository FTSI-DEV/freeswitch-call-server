export interface CDRItem {
    Id: number;
    PhoneNumberTo?: string;
    PhoneNumberFrom?: string;
    CallStatus?: string;
    CallUUID?: string;
    Duration?: string;
    DateCreated: string;
    RecordingUUID?: string;
    CallDirection?: string;
    ParentCallUid?: string;
}

export interface CDRPager {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface CDR {
    Data: {
        items: Array<CDRItem>,
        meta: CDRPager,
        detail: CDRItem
    }
}