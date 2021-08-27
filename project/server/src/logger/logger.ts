import { LoggerService } from "@nestjs/common";
import * as moment from 'moment';
import { createLogger, format, Logger } from 'winston';
import 'winston-daily-rotate-file';
import { Console, DailyRotateFile } from "winston/lib/winston/transports";
const util = require('util');

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


function transform(info: any) {
    const args = info[Symbol.for('splat')];
    if (args) { 
      if(typeof info.message === 'object'){
        info.message = util.format('', info.message, ...args); 
      }else{
        info.message = util.format(info.message, ...args); 
      }
      
    }
    else{
      if(typeof info.message === 'object'){
        info.message = util.format('', info.message)
      }
    }
    return info;
  }

interface ICustomLogger extends Logger{
    loggerService: LoggerService
}

const timezone = () => {
    return moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
}

export function getLog(label: string){
    const customFormat = format.printf(({ level, message, label , timestamp }) => {
        return `${timestamp} ${level} [${label}]: ${message}`;
    });

    const filename = 'freeswitchappLogger.%DATE%.log'
    const level = process.env.LOG_LEVEL ?? 'info';
    const dirname = process.env.LOGGER_DIR;
    const datePattern = 'YYY-MM-DD-HH';

    const transport = new DailyRotateFile({
        level,
        filename,
        dirname,
        datePattern,
        zippedArchive: true,
        format: format.combine(
            format.timestamp({
                format: timezone
            }),
            {transform},
            customFormat
            )
    });

    const logger = createLogger({
        transports: [transport],
        defaultMeta: { label: label }
    }) as ICustomLogger

    if (process.env.MODE === 'dev' ){
        logger.add(new Console({
            level,
            format: format.combine(
                format.timestamp({
                    format: timezone
                }),
                {transform},
                customFormat
            )
        }))
    }

    logger.loggerService = {
        log(message: any, context?: string) {
            logger.info(message, context)
        },
        error(message: any, trace?: string, context?: string) {
            logger.error(message, trace, context)
        },
        warn(message: any, context?: string) {
            logger.warn(message, context)
        },
        debug(message: any, context?: string) {
            logger.debug(message, context)
        },
        verbose(message: any, context?: string) {
            logger.verbose(message, context)
        }
    }

    return logger;
}
export {};