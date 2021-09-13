import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query, Request, Response } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RangeFileStreamResult } from 'src/utils/rangeFileStreamResult';
import { CallRecordingStorageDTO } from '../models/call-recording.dto';
import { CallRecordingService } from '../services/call-recording.service';

@Controller('call-recording')
export class CallRecordingController {

    constructor(
        private readonly _callRecordingStorageService: CallRecordingService
    ){}

    @Get('deleteCallRecording/:recordingId')
    async deleteCallRecording(
        @Param('recordingId') recordingId: number
    ):Promise<string>{

        let deleteRecord = await this._callRecordingStorageService.deleteCallRecording(recordingId);

        if (deleteRecord){
            return "Successfully deleted call recording";
        }
        
        return "Unable to delete call recording";
    }

    @Get('getCallRecordings')
    getCallRecordings(
        @Query('page' , new DefaultValuePipe(1), ParseIntPipe) page:number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
    ): Promise<Pagination<CallRecordingStorageDTO>>{

        limit = limit > 100 ? 100 : limit;

        return this._callRecordingStorageService.getCallRecordings({
            page,
            limit
        });
    }

    @Get('getCallRecord/:recordingId')
    async getCallRecord(
        @Param('recordingId') recordingId: number
    ):Promise<CallRecordingStorageDTO>{

        let callRecording = await this._callRecordingStorageService.getByRecordingId(recordingId);
    
        if (callRecording != null){
            return{
             RecordingId: callRecording.RecordingId,
             RecordingUUID : callRecording.RecordingUid,
             CallUUID : callRecording.CallUid,
             FilePath : callRecording.FilePath,
             IsDeleted: callRecording.IsDeleted,
             DateCreated : callRecording.DateCreated,
            //  CallId: callRecording.callDetailRecord.Id   
            };
        }
        
        return null;
    }

    @Get('getRecordFile/:recordingId')
    async getRecordFile(
        @Param('recordingId') recordingId: number,
        @Request() request,
        @Response() response
    ){
        let callRecording = await this._callRecordingStorageService.getByRecordingId(recordingId);

        if (callRecording != null){
            new RangeFileStreamResult(request, response, callRecording.FilePath, "audio/wav");
        }
        
        console.log('No recording file');
        return null;
    }
}
