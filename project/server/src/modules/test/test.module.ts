import { Module } from "@nestjs/common";
import { BullModuleQueue } from "src/bull-queue/bull.module";
import { GreetingModule } from "../greeting/greeting.module";
import { TestController2 } from "./test.controller";
import { TestService } from "./test.service";

@Module({
    imports: [TestService, BullModuleQueue, GreetingModule],
    exports: [TestService],
    providers: [TestService],
    controllers: [TestController2]
})

export class TestModule{}