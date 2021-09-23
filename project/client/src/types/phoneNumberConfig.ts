export interface PhoneNumberConfigPager {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export interface PhoneNumberConfigItem {
    friendlyName: string;
    httpMethod: string;
    id?: number;
    phoneNumber: string;
    webhookUrl: string;
    isDeleted:boolean;
}

export interface PhoneNumberConfig {
    Data: {
        items: Array<PhoneNumberConfigItem>,
        meta: PhoneNumberConfigPager
    },
    Message: "",
    Status: "",
    phoneConfigById: PhoneNumberConfigItem,
    items: Array<PhoneNumberConfigItem>,
    meta: PhoneNumberConfigPager,
} 