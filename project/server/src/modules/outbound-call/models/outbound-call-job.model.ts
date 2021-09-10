import { CDRModel } from "src/modules/call-detail-record/models/cdr.models";
import { CallRecordingModel } from "src/modules/call-recording/models/call-recording.model";

export class OutboundCallJobModelParam{
    cdrModel: CDRModel;
    callRecordingModel: CallRecordingModel;
}