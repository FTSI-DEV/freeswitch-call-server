import { FS_ESL } from "../constants/fs-esl.constants";
import { FreeswitchConfigHelper } from "./freeswitchConfig.helper";
const esl = require('modesl');

interface ConnResult {
    connectionObj: object;
    isSuccess: boolean;
    errorMessage: string
}

export const FreeswitchConnectionResult: ConnResult = {
    connectionObj: null,
    isSuccess: false,
    errorMessage: null
}

export const fsConnect = (): any => {
    
    return new Promise<any>((resolve,reject) => {

        let fsConfig = new FreeswitchConfigHelper().getFreeswitchConfig();
            
        let connection = new esl.Connection(fsConfig.ip, 
            fsConfig.port, 
            fsConfig.password);
        
        connection.on(FS_ESL.CONNECTION.ERROR, () => {
            FreeswitchConnectionResult.errorMessage = "Connection Error";
            reject(FreeswitchConnectionResult);
        });

        connection.on(FS_ESL.CONNECTION.READY, () => {
            FreeswitchConnectionResult.isSuccess = true;
            FreeswitchConnectionResult.connectionObj = connection;
            resolve(FreeswitchConnectionResult);
        })

    }).catch(err => console.log(err))
}

export class FreeswitchConnectionHelper{
    connect = fsConnect;
}
