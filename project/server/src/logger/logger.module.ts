import { Module } from "@nestjs/common";
import { CustomLogger } from "./logger";

@Module({
    providers: [ CustomLogger],
    exports: [CustomLogger]
})

export class CustomLoggerModule {}