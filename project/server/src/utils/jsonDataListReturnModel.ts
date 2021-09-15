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

export class JsonDataListReturnModel extends JsonDataListModel<object>{

    static Ok(message:string):JsonDataListModel<object>

    static Ok(message:string,data?:object):JsonDataListModel<object>

    static Ok(message:string='Ok',data?:object):JsonDataListModel<object>{
        let value = new JsonDataListModel<object>();

        value.Data = data;
        value.Message = message;
        value.Status = JsonResultStatus.OK;
     
        return value;
    }

    static Error(message:string='Error' ,data?:object):JsonDataListModel<object>{
        return this.CreateGenericErrorResponse(message,data);
    }

    static NotFound(message:string='Not found'):JsonDataListModel<object>{

        let value = new JsonDataListModel<object>();

        value.Message = message;

        return value;
    }

    static UnAuthorize(message:string='Unathorized'):JsonDataListModel<object>{
        
        let value = new JsonDataListModel<object>();

        value.Message = message;
        value.Status = JsonResultStatus.UNAUTHORIZED;

        return value;
    }

    static Forbidden(message:string='Forbidden'):JsonDataListModel<object>{

        let value = new JsonDataListModel<object>();

        value.Message = message;

        value.Status = JsonResultStatus.FORBIDDEN;

        return value;
    }

    static CreateGenericOKResponse(message:string='OK'):JsonDataListModel<object>{

        let value = new JsonDataListModel<object>();

        value.Message = message;

        value.Status = JsonResultStatus.OK;

        return value;
    }

    static CreateGenericErrorResponse(message:string='Not found', data?:object):JsonDataListModel<object>{
        
        let value = new JsonDataListModel<object>();

        value.Status = JsonResultStatus.ERROR;

        value.Data = data

        value.Message = message;

        return value;
    };
}
