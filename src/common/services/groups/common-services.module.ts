import { ArrayUtil } from './../utils/array-util';
import { DateUtil } from './../utils/date-util';
import { ClassUtil } from './../utils/class-util';
import { TopCommon } from './../../top-common/top-common';
import { Logs } from './../../services/logs';
import { DomHandler } from './../../services/dom/domhandler';
import { NgModule, Injectable } from '@angular/core';


/**
 * @author liurong
 * @date 2017-08-02
 * @notes 常用工具
 */
@Injectable()
export class CommonServices extends TopCommon{

    constructor(
        public logs: Logs,
        public classUtil: ClassUtil,
        public dateUtil: DateUtil,
        public arrayUtil: ArrayUtil,
        public domHandler: DomHandler
    ){
        super();
    }
  
}


/**
 * 常用的服务工具管理模块
 */
@NgModule({
    imports: [ 
     ],
    providers: [  
        Logs
        ,ClassUtil
        ,DomHandler
        ,DateUtil
        ,ArrayUtil
        ,CommonServices
    ]
}) export class CommonServicesModule {}



 