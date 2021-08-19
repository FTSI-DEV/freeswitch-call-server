import { FreeswithConfigModel } from "src/models/freeswitchConfig.model";

export class FreeswitchConfigHelper{

    //put the ip,password,port to environment variables
    getFreeswitchConfig(): FreeswithConfigModel{
        return{
            ip: process.env.ESL_CONNECTION_IP,
            password: process.env.ESL_CONNECTION_PASSWORD,
            port: process.env.ESL_CONNECTION_PORT
        };
    };
}