import { IPaginationOptions} from "nestjs-typeorm-paginate";
import { FreeswitchPhoneNumberConfigParam } from "src/models/freeswitchCallConfigModel";

//Use this interface in the controller
export interface IFreeswitchPhoneNumberConfigService{
    getPhoneNumberConfigById(id: number):FreeswitchPhoneNumberConfigParam;
    getAll(options: IPaginationOptions): Promise<any>;
    add(param:FreeswitchPhoneNumberConfigParam);
    update(param:FreeswitchPhoneNumberConfigParam):boolean;
}