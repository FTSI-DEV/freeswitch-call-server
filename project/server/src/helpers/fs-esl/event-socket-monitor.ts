import { FreeswitchConnectionHelper } from "./eslfreeswitch.connection";

export class StartFreeswitchApplication {
    
    private readonly _fsConnection = new FreeswitchConnectionHelper();

    startFS():any{
        this._fsConnection.startConnection()
        .then((connection) => {
            connection.subscirbe(ALL_EVENTS);
            connection.subscirbe(DTMF_EVENTS);

            //intercepting calls
            connection.on(FS_ESL.RECEIVED, fsEvent => {
                //code here
            });

            return connection;

        }).catch((err) => {
            console.log('UNEXPECTED ERROR ->', err);
        });
    }
}