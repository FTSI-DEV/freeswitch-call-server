export interface IOriginateOptions{
    profile: string;
    number: string;
    gateway: string;
    app?: string;
}

export class OriginationModel{
    phoneNumberTo: string;
    phoneNumberFrom: string;
    storeId: number;
}