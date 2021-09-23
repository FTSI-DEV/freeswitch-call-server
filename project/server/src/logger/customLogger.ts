import { Format } from "logform";
import { createLogger, format, Logger, transports } from "winston";

export const CUSTOM_LOGGER = 'CUSTOM_LOGGER';

interface ICustomAppLogger<T>{
    getLogger(label:string):Logger;
    info(message:string,ex:Error);
    warn(message:string,ex:Error);
    error(message:string,ex:Error);
}

export class CustomAppLogger<T> implements ICustomAppLogger<T>{

    constructor(
       private readonly _loggerName:string
    ){}

    getLogger(): Logger{

        console.log('name -> ', this._loggerName);

        let logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.errors({ stack : true }),
                this.customFormat()
            ),
            defaultMeta: { service : this._loggerName },
            transports: [
                new transports.File({
                    filename: 'fs.log', dirname: process.env.LOGGER_DIR
                })
            ]
        });

        if (process.env.NODE_ENV != 'production' ){
            logger.add(new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.simple()
                )
            }));
        }

        return logger;
    }

    info(message:string, ex:Error = null){

        let logger = this.getLogger();

        if (ex === null) logger.info(message);
        else logger.warn(message, ex);
    }

    warn(message:string, ex:Error = null){
        let logger = this.getLogger();

        if (ex === null) logger.warn(message);
        else logger.warn(message, ex);
    }

    error(message:string, ex:Error = null){
        let logger = this.getLogger();

        if (ex === null ) logger.error(message);
        else logger.error(message, ex);
    }
    
    private customFormat():Format{

        let customFormat = format.printf(({
            level,
            message,
            stack,
            timestamp
          }) => {
            
            let showStack: boolean = false;
        
            let newStack:string = "";
        
            if (level === "error"){
                showStack=true;
                newStack = stack;
            }
        
            return `${timestamp} ${level} [${this._loggerName}] - ${message}  ${newStack}`;
        });

        return customFormat;
    }
}

export class CLogger<T>{

    private readonly _customLogger: ICustomAppLogger<T> = null;

    constructor(
    ){}

    name(label:string){
        return label;
    }

    info(message:string, ex: Error = null){
        if (ex === null){

            let log = this._customLogger.getLogger("test");
        }
    }
}