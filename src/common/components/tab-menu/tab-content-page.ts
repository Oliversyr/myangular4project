import { TopCommon } from './../../top-common/top-common';
import { CommonServices } from './../../services/groups/common-services.module';
import { TabManager } from './tab-manager';
import { TabOuterUtil } from './tab-outer-util';
import { Injectable, QueryList, ElementRef } from '@angular/core';
import { Menu } from "./menu";

/**
 * 调用内容页面参数
 */
export interface ContentPageParam {
    moduleId: number ;
    attr: string;
    /**
     * 调用内容页面行为
     * 1. ROUTE: 路由到其它页面
     * 2. DELIVER_PARAM: 传递参数
     * 3. 默认: DELIVER_PARAM
     */
    active?: string;
    param?: any 
}

/**
 * @author liurong
 * @date 2017-08-17
 * @notes 页签内容界面服务类
 */
@Injectable()
export class TabContentPage extends TopCommon{
    
    private tabManager: TabManager ;
    private iframes: QueryList<ElementRef>;

    constructor(
        private tabOuterUtil: TabOuterUtil,
        private utils: CommonServices
         
    ) {
        super();
    }

    setTabManager(tabManager) {
        this.tabManager = tabManager ;   
    }

    setIframes(iframes) {
        this.iframes = iframes ;   
    }

 
    /**
     * 调用内容界面接口 ;传递参数、刷新界面、切换界面等
     * @param contentPageParam 
     */
    invokeContentPage(contentPageParam: ContentPageParam) {
        try {
            let tabIndex: number = this.tabManager.getTabIndexByModuleId(contentPageParam.moduleId, contentPageParam.attr);
            let myFrame = this.iframes.find((iframe,index) => index == tabIndex);
            let myFrame_doc = myFrame.nativeElement.contentWindow.document ;
            this.tabOuterUtil.invokeContentPage(contentPageParam, myFrame_doc);
        } catch (e) {
            this.utils.logs.error(this.CLASS_NAME,"invokeContentPage",e.stack);
        }
        //重置为空,否则引起内存泄漏
        this.iframes = null ;
    }

}