import { InjectQueue } from "@nestjs/bull";
import { Controller, Get } from "@nestjs/common";
import { Queue } from "bull";

@Controller('test')
export class TestController2{
    constructor(
        @InjectQueue('default')
        private testJob1: Queue
    ){}

    @Get('testApi')
    testApi()
    {
        this.testJob1.add('job1', {
            data: 1
        });

        this.testJob1.add('job2' , {
            data: 2
        });
    
    }
}