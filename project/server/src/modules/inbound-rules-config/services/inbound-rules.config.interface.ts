import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { InboundRulesConfigModel } from "../models/inbound-rules.model";

export const INBOUND_RULES_CONFIG_SERVICE = "INBOUND_RULES_CONFIG_SERVICE";

export interface IInboundRulesConfigService{
    add(param: InboundRulesConfigModel);
    update(param: InboundRulesConfigModel):Promise<boolean>;
    getByCallerId(callerId: string): Promise<InboundRulesConfigModel> ;
    getById(id: number): Promise<InboundRulesConfigModel>;
    delete(id:number):Promise<boolean>;
    getConfigs(options:IPaginationOptions):Promise<Pagination<InboundRulesConfigModel>>;
}