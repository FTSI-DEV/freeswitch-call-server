import { JsonResultStatus } from "./jsonResultStatus.enum";

export class JsonDataListModel<T>{

    constructor(){}

    Data?: T;
    Status: JsonResultStatus;
    Message?: string;
}

export interface JsonDataListModel<T>{
    Data?: T;
    Status: JsonResultStatus;
    Message?:string;
}

export class JsonDataListReturnModel extends JsonDataListModel<any>{

    static Ok(message:string):JsonDataListModel<any>;

    static Ok(message?:string,data?:any):JsonDataListModel<any>;

    static Ok(message:string='Ok',data?:any):JsonDataListModel<any>{
        
        let value = new JsonDataListModel<any>();

        value.Data = data;
        value.Message = message;
        value.Status = JsonResultStatus.OK;
     
        return value;
    }

    static Error(message:string='Error' ,data?:any):JsonDataListModel<any>{
        return this.CreateGenericErrorResponse(message,data);
    }

    static NotFound(message:string='Not found'):JsonDataListModel<any>{

        let value = new JsonDataListModel<any>();

        value.Message = message;

        return value;
    }

    static UnAuthorize(message:string='Unathorized'):JsonDataListModel<any>{
        
        let value = new JsonDataListModel<any>();

        value.Message = message;
        value.Status = JsonResultStatus.UNAUTHORIZED;

        return value;
    }

    static Forbidden(message:string='Forbidden'):JsonDataListModel<any>{

        let value = new JsonDataListModel<any>();

        value.Message = message;

        value.Status = JsonResultStatus.FORBIDDEN;

        return value;
    }

    static CreateGenericOKResponse(message:string='OK', data?:any):JsonDataListModel<any>{

        let value = new JsonDataListModel<any>();

        value.Message = message;

        value.Status = JsonResultStatus.OK;

        value.Data = data;

        return value;
    }

    static CreateGenericErrorResponse(message:string='Not found', data?:any):JsonDataListModel<any>{
        
        let value = new JsonDataListModel<any>();

        value.Status = JsonResultStatus.ERROR;

        value.Data = data

        value.Message = message;

        return value;
    };
}
