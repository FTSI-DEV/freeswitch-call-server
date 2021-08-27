import { Module } from "@nestjs/common";
import { ClickToCallModule } from "src/modules/click-to-call/click-to-call.module";
import { FsEslService } from "src/modules/click-to-call/click-to-call.service";
import { FreeswitchCallSystemModule } from "src/modules/freeswitch-call-system/freeswitch-call-system.module";
import { FreeswitchCallSystemService } from "src/modules/freeswitch-call-system/services/freeswitch-call-system.service";
import { ClickToCallJob } from "./clickToCallJob";
// import { TestJob } from "./clickToCallJob";

@Module({
    providers:[
        {
            provide: 'IBeeQueueJob',
            useClass: ClickToCallJob
        }
    ],
    exports: [ClickToCallJob]
})

export class ClickToCallJobModule{}