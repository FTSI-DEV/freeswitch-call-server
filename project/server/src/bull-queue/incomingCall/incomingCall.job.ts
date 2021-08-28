import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { IncomingCallService } from 'src/modules/incomingCall/incomingCall.service';

@Processor('default')
export class IncomingCallJob {
  constructor(private readonly _incomingCallService: IncomingCallService) {}

  @Process()
  handleTranscode(parameter: Job) {
    console.log('Start transcoding incoming call...');
    console.log('PARAMETER', parameter);

    this._incomingCallService.saveIncomingCallCDR({
      UUID: parameter.data.UUID,
      CallerIdNumber: parameter.data.CallerIdNumber,
      CallerName: parameter.data.CallerIdNumber,
      CalleeIdNumber: parameter.data.CalleeIdNumber,
      CallDirection: parameter.data.CallDirection,
      StartedDate: parameter.data.StartedDate,
      CallStatus: parameter.data.CallStatus,
      CallDuration: parameter.data.Duration,
      RecordingUUID: parameter.data.RecordingUUID,
    });

    console.log('result', parameter.data);

    console.log('Transcoding complete');
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
