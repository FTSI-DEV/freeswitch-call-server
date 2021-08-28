import { InjectQueue } from "@nestjs/bull";
import { Controller, Post } from "@nestjs/common";
import { Queue } from "bull";

@Controller('test')
export class TestController{
    constructor(
        @InjectQueue('default')
        private readonly audioQueue: Queue
    ){}

    @Post('transcode')
    async transcode(){
        await this.audioQueue.add(1);
    }
}