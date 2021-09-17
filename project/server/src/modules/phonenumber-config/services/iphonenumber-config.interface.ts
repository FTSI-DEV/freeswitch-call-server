import { IPaginationOptions, Pagination} from "nestjs-typeorm-paginate";
import { PhoneNumberConfigParam } from "src/modules/phonenumber-config/models/phoneNumberConfig.model";

export const PHONENUMBER_CONFIG_SERVICE = 'PHONENUMBER CONFIG SERVICE';

//Use this interface in the controller
export interface IPhoneNumberConfigService{
    add(param:PhoneNumberConfigParam);
    update(param:PhoneNumberConfigParam):Promise<boolean>;
    getById(id:number):Promise<PhoneNumberConfigParam>;
    getPhoneNumberConfigs(options:IPaginationOptions):Promise<Pagination<PhoneNumberConfigParam>>;
    deletePhoneNumberConfig(id:number):Promise<string>;
}