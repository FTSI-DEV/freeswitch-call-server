export class InboundCallConfigModel{
    callerId: string;
    webhookUrl: string;
    httpMethod:string;
    id?: number;
    isDeleted:boolean;
}

export class InboundCallConfigParam{
    callerId: string;
    webhookUrl: string;
    httpMethod:string;
    id?:number;
}
