import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { InboundCallConfigModel, InboundCallConfigParam } from "../models/inbound-call-config.model";

export const INBOUND_CALL_CONFIG_SERVICE = 'INBOUND_CALL_CONFIG_SERVICE';

export interface IInboundCallConfigService{
    add(param:InboundCallConfigParam):Promise<void>;
    update(param:InboundCallConfigParam):Promise<boolean>;
    getByCallerId(callerId:string):Promise<InboundCallConfigModel>;
    getById(id:number):Promise<InboundCallConfigModel>;
    getInboundCallConfigs(options:IPaginationOptions):Promise<Pagination<InboundCallConfigModel>>;
    deleteInboundCallConfig(id:number):Promise<string>;
}