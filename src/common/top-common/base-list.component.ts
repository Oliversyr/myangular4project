import { BaseComponent } from './base.component';


/**
 * @author liurong
 * @date 2017-08-02
 * @notes 
 * 详情顶级类 包含很多公用的信息
 */
export abstract class BaseListComponent extends BaseComponent {


    constructor(
    ) {
        super();
    }


    /**
     * 表格列点击事件
     * 子类必须重新方法,规则为: doClick+toolbar.name(第一字母大写)
     * 例如按钮名称 name="edit"
     * 则方调用方法: doEdit(param, event);
     * @param event 
     */
    // protected onGridLinkClick(emitOption: EmitOption) {
    //     let utils = this.baseListParentSvc.baseService.utils;
    //     let methodName = 'doClickColumn' + utils.classUtil.firstCapital(emitOption.active)  ;
    //     try {
    //         this[methodName].apply(this, [emitOption.param, emitOption.originalEvent]);
    //     } catch (error) {
    //         console.error(this.CLASS_NAME + ">> unimplementation %s function ; if you don't need, remove the button from toolbar",methodName, error.stack);
    //     }
    // }
    

}