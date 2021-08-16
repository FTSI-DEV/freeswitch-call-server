import { stringify } from "querystring";
import { CDRModels } from "src/models/cdr.models";

export class CDRHelper{

    getCallRecords(fsEvent):CDRModels{

        const eventName = fsEvent.getHeader('Event-Name');

        if (eventName != 'CHANNEL_HANGUP_COMPLETE') return;

        const uuid = this.getHeader('Unique-ID', fsEvent);
        const callerId = this.getHeader('Caller-Caller-ID-Number', fsEvent);
        const callerName = this.getHeader('Caller-Caller-ID-Name', fsEvent);
        const calleeIdNumber = this.getHeader('Caller-Callee-ID-Number', fsEvent);
        const callDirection = this.getHeader('Call-Direction', fsEvent);
        const hangup_cause = this.getHeader('Hangup-Cause', fsEvent);
        const started_date = this.getHeader('Event-Date-Local', fsEvent);
        const start_stamp = this.getHeader('Event-Date-Timestamp', fsEvent);
        const answer_stamp = this.getHeader('variable_answer_stamp' ,fsEvent);
        const end_stamp = this.getHeader('variable_end_stamp', fsEvent);
        const answer_epoch = this.getHeader('variable_answer_epoch', fsEvent);
        const start_epoch = this.getHeader('variable_start_epoch', fsEvent);
        const end_epoch = this.getHeader('variable_end_epoch' , fsEvent);

        const duration = this.calculateDuration(answer_epoch, end_epoch);

        console.log(eventName);
        
        console.log('JSON',JSON.stringify(fsEvent));

        console.log(`Name -> ${eventName}, 
                    UUID -> ${uuid} ,
                    CallerId -> ${callerId} ,
                    CallerName -> ${callerName} ,
                    calleIdNumber -> ${calleeIdNumber} ,
                    callDirection -> ${callDirection} ,
                    Hangup_Cause -> ${hangup_cause} ,
                    StartedDate -> ${started_date} , 
                    StartedStamp -> ${start_stamp} , 
                    AnswerStamp -> ${answer_stamp},
                    End_Stamp -> ${end_stamp} , 
                    Start_Epoch -> ${start_epoch} , 
                    End_Epoch -> ${end_epoch} , 
                    Answer_Epoch -> ${answer_epoch} , 
                    Durations -> ${duration}`);
        return{
            UUID: uuid,
            CallerIdNumber: callerId,
            CallerName: callerName,
            CalleeIdNumber: calleeIdNumber,
            CallDirection: callDirection,
            CallStatus: hangup_cause,
            StartedDate: started_date,
            StartStamp: start_stamp,
            AnswerStamp: answer_stamp,
            EndStamp: end_stamp,
            AnswerEpoch: answer_epoch,
            StartEpoch: start_epoch,
            EndEpoch: end_epoch,
            Duration: duration
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