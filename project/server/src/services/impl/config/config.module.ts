import { Module } from "@nestjs/common";
import { CONFIG_SERVICE } from "src/services/interface/config/iconfig.interface";
import { ConfigService, configService } from "./config.service";


@Module({
    providers: [
      {
        // You can switch useClass to different implementation
        useClass: ConfigService,
        provide: CONFIG_SERVICE
      }
    ]
  })
  export class GreetingModule {}