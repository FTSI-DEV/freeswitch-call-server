import { ALL_EVENTS, DTMF_EVENTS, FS_ESL } from "../constants/fs-esl.constants";
import { CallDispatchHelper } from "./callDispatch.helper";
import { CDRHelper } from "./cdr.helper";

export class StartFreeswitchApplication {
    
    // private readonly _fsConnection = new FreeswitchConnectionHelper();

    // startFS():any{
    //     let ff = this._fsConnection.connect().then((connection) => {
    //         console.log('trying to subscribe to the event: ', connection.event);

    //         new CallDispatchHelper().clickToCall(connection, {
    //             phoneNumberFrom: '1000',
    //             phoneNumberTo : '1000',
    //             storeId: 60
    //         });
    //         //intercepting calls
    //         connection.on(FS_ESL.RECEIVED, fsEvent => {
    //            new CDRHelper().getCallRecords(fsEvent);
    //         });

    //         return connection;

    //     }).catch((err) => {
    //         console.log('UNEXPECTED ERROR ->', err);
    //     });
    // }
}