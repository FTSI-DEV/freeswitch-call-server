import { FreeswitchConfigHelper } from "./freeswitchConfig.helper";
const esl = require('modesl');

let connection: any = null;

const connect = (): any => {
    return new Promise<any>((resolve,reject) => {

        if (connection !== null && connection.connected()) {
            resolve(connection);
        }
        else {
            
            let fsConfig = new FreeswitchConfigHelper().getFreeswitchConfig();

            connection = new esl.Connection(fsConfig.ip, fsConfig.port, fsConfig.password);

            connection.on(FS_ESL.CONNECTION.ERROR, () => {
                reject('Connection Error');
            });

            connection.on(FS_ESL.CONNECTION.CLOSED, () => {
                reject('Connection Closed');
            });

            connection.on(FS_ESL.CONNECTION.READY, () => {
                resolve(connection);
            })
        }
    });
}

export class FreeswitchConnectionHelper{
    startConnection = connection;
}