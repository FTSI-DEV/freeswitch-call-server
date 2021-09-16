import { CDRModel } from "src/modules/call-detail-record/models/cdr.models";
import { CHANNEL_VARIABLE } from "../constants/channel-variables.constants";

export class CDRHelper{

    getCallerId(fsEvent):string{
        return this.getHeader('Caller-Caller-ID-Number', fsEvent);
    }

    getCallerDestinationNumber(fsEvent):string{
        return this.getHeader('Caller-Destination-Number',fsEvent);
    }

    getCallRecords(fsEvent):CDRModel{
        
        const uuid = this.getHeader(CHANNEL_VARIABLE.UNIQUE_ID, fsEvent);
        const callerId = this.getHeader(CHANNEL_VARIABLE.CALLER_CALLER_ID_NUMBER, fsEvent);
         const calleeIdNumber = this.getHeader(CHANNEL_VARIABLE.CALLER_CALLE_ID_NUMBER, fsEvent);
        const callDirection = this.getHeader(CHANNEL_VARIABLE.CALL_DIRECTION, fsEvent);
        const hangup_cause = this.getHeader(CHANNEL_VARIABLE.HANGUP_CAUSE, fsEvent);
        const started_date = this.getHeader(CHANNEL_VARIABLE.EVENT_DATE_LOCAL, fsEvent);
        const answer_epoch = this.getHeader(CHANNEL_VARIABLE.ANSWER_EPOCH, fsEvent);
        const end_epoch = this.getHeader(CHANNEL_VARIABLE.END_EPOCH , fsEvent);

        let duration = 0;

        if (answer_epoch === "0" ||
            end_epoch === "0"){

            duration = 0;
        }
        else
        {
            duration = this.calculateDuration(answer_epoch, end_epoch);
        }

        console.log('duration', duration);
        console.log('answer_epoch ', answer_epoch);
        console.log('end_epoch', end_epoch);

        return{
            UUID: uuid,
            PhoneNumberFrom: callerId,
            PhoneNumberTo: calleeIdNumber,
            CallDirection: callDirection,
            CallStatus: hangup_cause,
            StartedDate: started_date,
            Duration: duration,
            Id: null,
            RecordingUUID: uuid
        };
    }

    private getHeader(variableName: string, fsEvent):string{
        return fsEvent.getHeader(variableName);
    }

    private calculateDuration(start_epoch:any, end_epoch: any):any{
        const answeredDate = new Date(start_epoch*1000);
        const hangupDate = new Date(end_epoch*1000);

        // console.log('Answered Time -> ', answeredDate.toUTCString());
        // console.log('HangupTime ->' , hangupDate.toUTCString());

        let duration = Math.abs(answeredDate.getTime() - hangupDate.getTime());

        return duration;
    }
}