import { IPaginationOptions} from "nestjs-typeorm-paginate";
import { FreeswitchCallConfigModelParam } from "src/models/freeswitchCallConfigModel";

//Use this interface in the controller
export interface IFreeswitchCallConfigService{
    saveUpdateCallConfig(callConfigParam: FreeswitchCallConfigModelParam);
    getCallConfigById(id: number):FreeswitchCallConfigModelParam;
    getAll(options: IPaginationOptions): Promise<any>;
}