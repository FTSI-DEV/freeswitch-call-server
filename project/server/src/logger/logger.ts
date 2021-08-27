import { LoggerService } from "@nestjs/common";

export class CustomLogger implements LoggerService{

    constructor(context?:string) {}

    log(message: any, context?: string) {
        console.log(message, context);
    }
    error(message: any, trace?: string, context?: string) {
       console.log(message, trace, context);
    }
    warn(message: any, context?: string) {
        console.log(message, context);
    }
    debug?(message: any, context?: string) {
        console.log(message, context);
    }
    verbose?(message: any, context?: string) {
        console.log(message, context);
    }
}