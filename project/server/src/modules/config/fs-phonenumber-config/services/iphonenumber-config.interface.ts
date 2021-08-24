import { IPaginationOptions} from "nestjs-typeorm-paginate";
import { FreeswitchPhoneNumberConfigParam } from "src/models/freeswitchCallConfigModel";

//Use this interface in the controller
export interface IFreeswitchPhoneNumberConfigService{
    saveUpdatePhoneNumberConfig(callConfigParam: FreeswitchPhoneNumberConfigParam);
    getPhoneNumberConfigById(id: number):FreeswitchPhoneNumberConfigParam;
    getAll(options: IPaginationOptions): Promise<any>;
}