import { FreeswitchCallConfigModelParam } from "src/models/freeswitchCallConfigModel";

//Use this interface in the controller
export interface IFreeswitchCallConfigService{
    saveCallSettings(callConfigParam: FreeswitchCallConfigModelParam);
    getCallConfigById(id: number):Promise<FreeswitchCallConfigModelParam>;
}