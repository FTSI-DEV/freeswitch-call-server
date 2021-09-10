import { ReturningStatementNotSupportedError } from "typeorm";
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

    static Ok(message:string):JsonDataListModel<object>{
        message = 'OK';
        return this.CreateGenericOKResponse(message);
    }

    static Error(message:string ,data?:object):JsonDataListModel<object>{
        message = 'Error';
        return this.CreateGenericErrorResponse(message,data);
    }

    static NotFound(message:string):JsonDataListModel<object>{
        let value = new JsonDataListModel<object>();

        value.Status = JsonResultStatus.NOT_FOUND;
        value.Message = 'Not found';

        return value;
    }

    static UnAuthorize(message:string):JsonDataListModel<object>{
        
        let value = new JsonDataListModel<object>();

        value.Message = 'Unauthorized';
        value.Status = JsonResultStatus.UNAUTHORIZED;

        return value;
    }

    static Forbidden(message:string):JsonDataListModel<object>{

        let value = new JsonDataListModel<object>();

        value.Message = 'Forbidden';
        value.Status = JsonResultStatus.FORBIDDEN;

        return value;
    }

    static CreateGenericOKResponse(message:string):JsonDataListModel<object>{

        let value = new JsonDataListModel<object>();

        value.Message = 'OK';

        value.Status = JsonResultStatus.OK;

        return value;
    }

    static CreateGenericErrorResponse(message:string, data?:object):JsonDataListModel<object>{
        
        let value = new JsonDataListModel<object>();

        value.Status = JsonResultStatus.ERROR;

        value.Message = 'Not found';

        value.Data = data

        return value;
    };
}
