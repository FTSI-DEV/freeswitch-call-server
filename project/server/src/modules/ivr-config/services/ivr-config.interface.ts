import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { IvrConfigModel } from "../models/ivr-config.model";

export const IVR_CONFIG_SERVICE = 'IVR_CONFIG_SERVICE';

export interface IIvrConfigService{
    add(param: IvrConfigModel);
    update(param: IvrConfigModel): Promise<boolean>;
    getByCallerId(callerId: string): Promise<IvrConfigModel>;
    getById(id: number): Promise<IvrConfigModel>;
    delete(id:number):Promise<boolean>;
    getIvrConfigs(options:IPaginationOptions):Promise<Pagination<IvrConfigModel>>;
    
}