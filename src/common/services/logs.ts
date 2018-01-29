// import { Config } from './../../global/config';
import { TopCommon } from '../top-common/top-common';
import {  Injectable } from '@angular/core';

// import  '../../global/config.js' ;
// declare var config: Config ;
enum  ENUM_LOG_LEVEL {
    DEBUG,
    LOG,
    INFO,
    WARN,
    ERROR
}


/**
 * @author liurong
 * @date 2017-08-02
 * @notes 日志管理
 */
@Injectable()
export class Logs extends TopCommon {

    private logLevel: ENUM_LOG_LEVEL = ENUM_LOG_LEVEL.DEBUG;
     
    private traceFlag: boolean =  true;

    constructor() {
        super();
/*         if(config.logLevel) {
            config.logLevel = config.logLevel.toUpperCase();
        }
        this.logLevel = ENUM_LOG_LEVEL[config.logLevel] || ENUM_LOG_LEVEL.WARN ;
        this.traceFlag = config.logIsTrace ; */
    }

    
    getLogLevel(): string {
        return ENUM_LOG_LEVEL[this.logLevel] ;
    }

    private trace() {
        if(this.traceFlag) {
            console.trace(">>>trace: the more info...");
        }
    }

    debug(...any){
        if(this.logLevel >= ENUM_LOG_LEVEL.DEBUG){
            console.debug.apply(console, arguments);
            this.trace();
            
        }
    }

    log(...any){
        if(this.logLevel >= ENUM_LOG_LEVEL.LOG){
            console.log.apply(console, arguments);
            this.trace();
        }
    }

    info(...any){
        if(this.logLevel >= ENUM_LOG_LEVEL.INFO){
            console.info.apply(console, arguments);
            this.trace();
        }
    }

    warn(...any){
        if(this.logLevel >= ENUM_LOG_LEVEL.WARN){
            console.warn.apply(console, arguments);
            this.trace();
        }
    }

    error(...any){
        console.error.apply(console, arguments);
        // console.trace(">>>trace: then more info...");
    }

    /**
     * 自定义异常
     * 
     * @param {any} param 
     * @memberof Logs
     */
    throwError(...param) {
        console.error.apply(console, param);
        throw new Error("error stack..");
    }

}