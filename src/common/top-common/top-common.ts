/**
 * @author liurong
 * @date 2017-08-02
 * @notes 
 * 顶级类 包含很多公用的信息
 */
export class TopCommon {

    protected CLASS_NAME: string ;

    constructor() {
        this.CLASS_NAME = this.constructor.name;
    }

}