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
}

export interface PhoneNumberConfig {
    phoneConfigById: PhoneNumberConfigItem,
    items: Array<PhoneNumberConfigItem>,
    meta: PhoneNumberConfigPager,
} 