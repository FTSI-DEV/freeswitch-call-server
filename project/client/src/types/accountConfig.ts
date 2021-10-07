export interface AccountConfigItem {
    id: number;
    accountSID: string;
    accountName: string;
    authToken: string;
    dateCreated: string;
    isActive: boolean;
    authKey?: string;
}

export interface AccountConfigPager {
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 1,
    totalPages: 0,
    currentPage: 1
}

export interface AccountConfig {
    Data: {
        items: AccountConfigItem[],
        meta: AccountConfigPager,
        configItem: AccountConfigItem
    }
}