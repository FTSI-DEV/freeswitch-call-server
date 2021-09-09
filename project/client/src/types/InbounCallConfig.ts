export interface InboundConfigItem {
    callerId: string;
    httpMethod: string;
    webhookUrl: string;
    id?: number;
}

export interface InboundConfigPager {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
}

export interface InboundConfig {
    items: Array<InboundConfigItem>,
    meta: InboundConfigPager,
    inboundConfigById: InboundConfigItem
}