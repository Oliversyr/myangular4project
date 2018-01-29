import { TopCommon } from './top-common';
import { Injectable } from '@angular/core';

/**
 * @author liurong
 * @date 2017-10-19
 * @notes 通用列表服务 
 * 减少开发过程中需要单独每个去引入
 */
@Injectable()
export class BaseListService extends TopCommon{

    constructor(
    ){
        super();
    }
}