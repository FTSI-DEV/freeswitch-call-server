import { ALL_EVENTS, DTMF_EVENTS, FS_ESL } from "../constants/freeswitch.constants";
import { CDRHelper } from "./cdr.helper";
import { FreeswitchConnectionHelper, connect } from "./eslfreeswitch.connection";

export class StartFreeswitchApplication {
    
    private readonly _fsConnection = new FreeswitchConnectionHelper();

    startFS():any{
        this._fsConnection.connect().then((connection) => {
            console.log('trying to subscribe to the event: ', connection.event);

            //intercepting calls
            connection.on(FS_ESL.RECEIVED, fsEvent => {
               new CDRHelper().getCallRecords(fsEvent);
            });

            return connection;

        }).catch((err) => {
            console.log('UNEXPECTED ERROR ->', err);
        });
    }
}