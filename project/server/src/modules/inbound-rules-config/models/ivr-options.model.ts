export class IvrOptionsCommandModel{
    ivrScript?:string;
    welcomeMessage?:string;
    welcomeRecordUrl?: string;
    failedRetryMessage?:string;
    failedMessage?:string;
    redirectMessage?:string;
    wrongInputRetryMessage?:string;
    ivrRetryCount?:number;
    preRedirectMessage?:string;
    ivrOptions:IvrOptionsModel[] = [];
}

export class IvrOptionsModel{
    callTypeId?:number;
    digitNumberInput?:number;
    forwardingNumber?:string;
}