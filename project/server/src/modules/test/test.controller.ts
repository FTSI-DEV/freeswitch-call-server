import { InjectQueue } from "@nestjs/bull";
import { Controller, Get } from "@nestjs/common";
import { Queue } from "bull";
import { response } from "express";
import { TestService } from "./test.service";

@Controller('test')
export class TestController2{
    constructor(
        private readonly testService : TestService
    ){}

    @Get('testSofiaStatus')
    async testSofiaStatus(): Promise<string>
    {
       let result = await this.testService.triggerSofiaStatus();

       return result;
    }
}