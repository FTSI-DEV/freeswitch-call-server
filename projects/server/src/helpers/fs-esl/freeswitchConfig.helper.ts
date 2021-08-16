import { FreeswithConfigModel } from "src/models/freeswitchConfig.model";

export class FreeswitchConfigHelper{

    //put the ip,password,port to environment variables
    getFreeswitchConfig(): FreeswithConfigModel{
        return{
            ip: '192.168.18.54',
            password: 'ClueCon',
            port: 8021
        };
    };
}