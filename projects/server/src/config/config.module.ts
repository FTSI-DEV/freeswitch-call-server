import { Module } from "@nestjs/common";
import { ConfigService, configService } from "./config.service";
import { CONFIG_SERVICE } from "./iconfig.interface";


@Module({
    providers: [
      {
        // You can switch useClass to different implementation
        useClass: ConfigService,
        provide: CONFIG_SERVICE
      }
    ]
  })
  export class ConfigModule {}