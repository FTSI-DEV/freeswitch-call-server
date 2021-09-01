import { stringify } from "querystring";
import { CDRModels } from "src/models/cdr.models";
import { CHANNEL_VARIABLE } from "../constants/channel-variables.constants";

export class CDRHelper{

    getCallerId(fsEvent):string{
        return this.getHeader('Caller-Caller-ID-Number', fsEvent);
    }

    getCallerDestinationNumber(fsEvent):string{
        return this.getHeader('Caller-Destination-Number',fsEvent);
    }

    getCallRecords(fsEvent):CDRModels{
        const uuid = this.getHeader(CHANNEL_VARIABLE.UNIQUE_ID, fsEvent);
        const callerId = this.getHeader(CHANNEL_VARIABLE.CALLER_CALLER_ID_NUMBER, fsEvent);
        const callerName = this.getHeader(CHANNEL_VARIABLE.CALLER_CALLER_ID_NAME, fsEvent);
        const calleeIdNumber = this.getHeader(CHANNEL_VARIABLE.CALLER_CALLE_ID_NUMBER, fsEvent);
        const callDirection = this.getHeader(CHANNEL_VARIABLE.CALL_DIRECTION, fsEvent);
        const hangup_cause = this.getHeader(CHANNEL_VARIABLE.HANGUP_CAUSE, fsEvent);
        const started_date = this.getHeader(CHANNEL_VARIABLE.EVENT_DATE_LOCAL, fsEvent);
        const answer_epoch = this.getHeader(CHANNEL_VARIABLE.ANSWER_EPOCH, fsEvent);
        const end_epoch = this.getHeader(CHANNEL_VARIABLE.END_EPOCH , fsEvent);

        const duration = this.calculateDuration(answer_epoch, end_epoch);

        return{
            UUID: uuid,
            CallerIdNumber: callerId,
            CallerName: callerName,
            CalleeIdNumber: calleeIdNumber,
            CallDirection: callDirection,
            CallStatus: hangup_cause,
            StartedDate: started_date,
            CallDuration: duration,
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

        console.log('Answered Time -> ', answeredDate.toUTCString());
        console.log('HangupTime ->' , hangupDate.toUTCString());

        let duration = Math.abs(answeredDate.getTime() - hangupDate.getTime());

        return duration;
    }
}