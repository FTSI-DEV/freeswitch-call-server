// export class OriginateModel{
//     callUrl: string;
//     extension: string;
//     applicationName: string;
//     dialplan: string;
//     context: string;
//     cid_name: string;
//     cid_num: string;
//     timeout_sec: number;
// }

export class OriginateModel{
    appArgs: any;
    gateway1: string;
    gateway2: string;
    originationNumber: number;
    extensionGateway1: number;
    extensionGateway2: number;
    callUrl: string;
    applicationName: string;
    dialplan: string;
    context: string;
    cidName: string;
    cidNumber: string;
    timeOutSec: number;
}

export interface IOriginateOptions{
    profile: string;
    number: string;
    gateway: string;
    app?: string;
}