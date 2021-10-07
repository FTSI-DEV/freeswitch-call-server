import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { AccountAuthMiddleware } from "src/auth/middlewares/account-auth.middleware";
import { UserAuthMiddleware } from "src/auth/middlewares/user-auth.middleware";
import { BullModuleQueue } from "src/bull-queue/bull.module";
import { GreetingModule } from "../greeting/greeting.module";
import { TestController2 } from "./test.controller";
import { TestService } from "./test.service";

@Module({
    imports: [TestService, BullModuleQueue, GreetingModule, AuthModule],
    exports: [TestService],
    providers: [TestService],
    controllers: [TestController2]
})

export class TestModule implements NestModule{
    public configure(consumer:MiddlewareConsumer){
        consumer
            .apply(UserAuthMiddleware)
            .forRoutes(
              { path: '/**' ,  method: RequestMethod.ALL }
            )
        consumer
            .apply(AccountAuthMiddleware)
            .forRoutes(
                { path: '/**' ,  method: RequestMethod.ALL }
              )
      }
}