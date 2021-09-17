import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, Inject, Query } from "@nestjs/common";
import { Queue } from "bull";
import { response } from "express";
import { GREETING_SERVICE, IGreetingService } from "../greeting/greeting-service.interface";
import { TestService } from "./test.service";

@Controller('test')
export class TestController2{
    constructor(
        private readonly testService : TestService,
        @InjectQueue('default')
        private readonly _inboundCall: Queue,
        @Inject(GREETING_SERVICE)
        private readonly _greetingService: IGreetingService
    ){}

    @Get('testGreeting')
    async getGreeting(@Query('name') name:string):Promise<string>{
        return await this._greetingService.greet(name || 'Test Vena');
    }

    @Get('testSofiaStatus')
    async testSofiaStatus(): Promise<string>
    {
       let result = await this.testService.triggerSofiaStatus();

       return result;
    }

    @Get('testJob')
    testJob(){
        let sample = this._inboundCall.add('outhere', {
            data: 'hellow'
        });
    }
}