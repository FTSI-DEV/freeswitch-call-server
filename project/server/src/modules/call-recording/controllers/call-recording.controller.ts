import { Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Query, Request, Response } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';
import { RangeFileStreamResult } from 'src/utils/rangeFileStreamResult';
import { CallRecordingStorageDTO } from '../models/call-recording.dto';
import { CALL_RECORDING_SERVICE, ICallRecordingService } from '../services/call-recording.interface';
import { CallRecordingService } from '../services/call-recording.service';
import path from 'path';

@Controller('/api/call-recording')
export class CallRecordingController {

    constructor(
        @Inject(CALL_RECORDING_SERVICE)
        private readonly _callRecordingStorageService: ICallRecordingService
    ){}

    @Get('deleteCallRecording/:recordingId')
    async deleteCallRecording(
        @Param('recordingId') recordingId: number
    ):Promise<JsonDataListReturnModel>{

        let deleteRecord = await this._callRecordingStorageService.deleteCallRecording(recordingId);

        if (deleteRecord){
            return JsonDataListReturnModel.Ok("Successfully deleted call recording");
        }
        
        return JsonDataListReturnModel.Error("Unable to delete call recording");
    }

    @Get('getCallRecordings')
    async getCallRecordings(
        @Query('page' , new DefaultValuePipe(1), ParseIntPipe) page:number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
    ): Promise<JsonDataListReturnModel>{

        limit = limit > 100 ? 100 : limit;

        let recordings = await this._callRecordingStorageService.getCallRecordings({
            page,
            limit
        });

        return JsonDataListReturnModel.Ok(null,recordings);
    }

    @Get('getCallRecord/:recordingId')
    async getCallRecord(
        @Param('recordingId') recordingId: number
    ):Promise<JsonDataListReturnModel>{

        let callRecording = await this._callRecordingStorageService.getByRecordingId(recordingId);
    
        if (callRecording != null){
            let retVal: CallRecordingStorageDTO = {
                RecordingId: callRecording.RecordingId,
                RecordingUUID : callRecording.RecordingUid,
                CallUUID : callRecording.CallUid,
                FilePath : callRecording.FilePath,
                IsDeleted: callRecording.IsDeleted,
                DateCreated : callRecording.DateCreated,
            }

            return JsonDataListReturnModel.Ok(null, retVal);
        }
        
        return JsonDataListReturnModel.Ok('No record to be displayed');
    }

    @Get('getRecordFile/:recordingId')
    async getRecordFile(
        @Param('recordingId') recordingId: number,
        @Request() request,
        @Response() response
    ):Promise<any>{

        let callRecording = await this._callRecordingStorageService.getByRecordingId(recordingId);

        if (callRecording !== undefined){
            let basePath = process.env.CALL_RECORDING_BASE_PATH;

            let filePath = path.join(basePath, callRecording.FilePath);

            return new RangeFileStreamResult(request, response, filePath, "audio/wav");
        }
        else
        {
            return 'No recording file found.';
        }

        // let filePath = "/var/lib/freeswitch/recordings/2b0deac8-3b14-4618-97e7-7e75b7bf2687.wav";
    }
}
