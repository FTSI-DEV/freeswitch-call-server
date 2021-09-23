import { Module } from "@nestjs/common";
import { CustomAppLogger, CUSTOM_LOGGER } from "./customLogger";

@Module({
    providers: [
        {
            useClass: CustomAppLogger,
            provide: CUSTOM_LOGGER
        }
    ],
    exports: [CUSTOM_LOGGER]
})

export class CustomLoggerModule {}