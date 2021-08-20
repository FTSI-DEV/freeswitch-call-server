import { FreeswitchCallConfigModelParam } from "src/models/freeswitchCallConfigModel";

//Use this interface in the controller
export interface IFreeswitchCallConfigService{
    saveUpdateCallConfig(callConfigParam: FreeswitchCallConfigModelParam);
    getCallConfigById(id: number):Promise<FreeswitchCallConfigModelParam>;
}