import { InjectQueue } from "@nestjs/bull";
import { Controller } from "@nestjs/common";
import { Queue } from "bull";

@Controller('test')
export class TestController2{
    constructor(
    ){}
}