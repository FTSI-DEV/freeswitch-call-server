import { ALL_EVENTS, DTMF_EVENTS, FS_ESL } from "../constants/freeswitch.constants";
import { CallDispatchHelper } from "./callDispatch.helper";
import { CDRHelper } from "./cdr.helper";
import { FreeswitchConnectionHelper, fsConnect } from "./eslfreeswitch.connection";

export class StartFreeswitchApplication {
    
    private readonly _fsConnection = new FreeswitchConnectionHelper();

    startFS():any{
        this._fsConnection.connect().then((connection) => {
            console.log('trying to subscribe to the event: ', connection.event);

            new CallDispatchHelper().clickToCall2(connection, '1000', '4001', 'vena1001')
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