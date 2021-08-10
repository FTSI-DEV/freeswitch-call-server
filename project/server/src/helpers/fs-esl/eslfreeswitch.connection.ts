import { FS_ESL } from "../constants/freeswitch.constants";
import { FreeswitchConfigHelper } from "./freeswitchConfig.helper";
const esl = require('modesl');

let connection: any = null;

export const connect = (): any => {
    return new Promise<any>((resolve,reject) => {

        if (connection !== null && connection.connected()) {
            console.log('TEST 1' );
            resolve(connection);
        }
        else {
            
            let fsConfig = new FreeswitchConfigHelper().getFreeswitchConfig();

            connection = new esl.Connection(fsConfig.ip, fsConfig.port, fsConfig.password);

            connection.on(FS_ESL.CONNECTION.ERROR, () => {
                console.log('TEST 1' );
                reject('Connection Error');
            });

            connection.on(FS_ESL.CONNECTION.CLOSED, () => {
                console.log('TEST 1' );
                reject('Connection Closed');
            });

            connection.on(FS_ESL.CONNECTION.READY, () => {
                console.log('TEST2' );
                resolve(connection);
            })
        }
    }).catch(err => console.log(err))
}

export class FreeswitchConnectionHelper{
    startConnection = connection;
    connect = connect;
}