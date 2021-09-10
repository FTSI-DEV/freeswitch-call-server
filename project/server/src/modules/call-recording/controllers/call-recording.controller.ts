import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
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
             CallId: callRecording.callDetailRecord.Id   
            };
        }
        
        return null;
    }
}
