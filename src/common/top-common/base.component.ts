import { SuiSpinService } from './../components/spin/sui-spin.service';
import { Observable } from 'rxjs/Rx';
import { GlobalService } from './../global/global.service';
import { SuiRouterService } from './../directives/router/sui-router.sevice';
import { KeyboardService } from './../directives/keyboard/keyboard.service';
import { ModuleFeatureRight, ModuleRightService } from './module-right.service';
import { BaseService } from './base.service';
import { ModalService } from './../components/modal/modal.service';
import { TabOuterUtil } from './../components/tab-menu/tab-outer-util';
import { CommonServices } from './../services/groups/common-services.module';
import { ContentPageParam } from './../components/tab-menu/tab-content-page';
import { LeftMenu } from './../components/tab-menu/left-menu';
import { Params, Router } from '@angular/router';
import { ElementRef, ViewChildren, QueryList, HostListener } from '@angular/core';
import { TabEntryParam, TAB_ACTIVE } from './../components/tab-menu/tab-entry.param';
import { Tab } from './../components/tab-menu/tab';
import { TopCommon } from './top-common';
import { ResponseRetCode, SuiResponse } from '../services/https/sui-http-entity';

/**
 * @author liurong
 * @date 2017-08-02
 * @notes 应用模块基础组件类 : 列表、详情、编辑界面都需要继承
 */
export class BaseComponent extends TopCommon {

    // protected moduleId: number;
    protected mRight: ModuleFeatureRight;

    // @ViewChildren(HotKeyDirective) hotKeyDirectives: QueryList<HotKeyDirective>;
    // HOTKEYS: any = HOTKEYS;

    /**
     * 当前页签
     */
    protected tab: Tab;
    private EL_TAB_INFO: string = "EL_TAB_INFO";
    protected ATTR = {
        A: "A",
        B: "B",
        M: "M",
        L: "L"
    }

    private $$commonServices: CommonServices
    private $$globalService: GlobalService;
    private $$tabOuterUtil: TabOuterUtil;
    private $$moduleRightService: ModuleRightService;
    private $$rootElement: ElementRef;
    private $$router: SuiRouterService;
    private $$keyboardService: KeyboardService;
    private $$modalService: ModalService;
    private $$suiSpinService: SuiSpinService;

    /**
     * 默认获取焦点元素
     */
    private defaultFoscuElement: HTMLElement;


    constructor(
    ) {
        super();
        // setTimeout(() => {

        // },100);

    }

    ngOnInit() {
        let url: string;
        try {
            this.initServices();
            url = "/" + this.$$router.getRouterUrl();
            this.bindEvent(url);
        } catch (error) {
            // console.error(error.stack);
            // console.error(error.message);
            ((this.$$rootElement.nativeElement) as HTMLElement).innerHTML="";
        }
        
    }

    /**
     * 页签初始化前,请求配置参数
     * 1. 数据必须请求成功,否则不允许进入该界面
     * 1. 返回监视结果必须为SuiResponse
     * 1. Observable<SuiResponse<>>
     * @protected
     * @param {Observable<SuiResponse<any>>[]} requests 
     * @returns 
     * @memberof BaseComponent
     */
    protected requestConfigBeforePageInit(requests: Observable<SuiResponse<any>>[]) {
        if (!requests || requests.length == 0) {
            this.$$commonServices.logs.throwError(" request config faile before page init, becuase request is null or empty");
        }
        return new Observable<any>(observer => {
            let execMethod = (_requests) => {
                let spin = this.$$suiSpinService.createSpin("初始化参数中...", this.$$rootElement.nativeElement);
                Observable.forkJoin(_requests)
                    .subscribe((results: any[]) => {
                        this.$$suiSpinService.closeSpin(spin);
                        for (let result of results) {
                            if (result.retCode != ResponseRetCode.SUCCESS) {
                                console.debug(" init param faile...", result);
                                let modalMethod = 'modalConfirm';
                                let message: string = `初始化参数失败,无法使用该模块;<br>点击"确定"请重试;<br>点击"取消"关闭页签`;
                                /* 
                                //暂时去掉,没有首页
                                    if (this.$$globalService.tabManager.getTabIndexByModuleId(this.tab.moduleid, this.tab.attr) == 0) {
                                    //第一页签不允许关闭
                                    modalMethod = 'modalAlert';
                                    message = `初始化参数失败,无法使用该模块;<br>点击"确定"请重试;`;
                                } */
                                this.$$modalService[modalMethod](message).subscribe((resultCode) => {
                                    if (resultCode === "OK") {
                                        execMethod(_requests);
                                    } else {
                                        this.forceClosePage();
                                    }

                                });
                                return;
                            }
                        }
                        observer.next(results);
                        observer.complete();
                        this.focus();
                    });
            };
            execMethod(requests);
        });





    }

    /**
     * 
     * 初始化页面键盘keydown事件
     * @param {any} event 
     * @memberof BaseComponent
     */
    // @HostListener('keydown', ['$event'])
    // onkeydown(event) {
    //     this.$$keyboardService.initHotkey(this.hotKeyDirectives, event);

    // }

    private initServices() {
        let baseService: BaseService = this["baseService"];
        this.$$globalService = baseService.globalService;
        this.$$commonServices = baseService.commonServices;
        this.$$tabOuterUtil = baseService.tabOuterUtil;
        this.$$moduleRightService = baseService.moduleRightService;
        this.$$rootElement = this["rootElement"];
        this.$$router = baseService.router;
        this.$$keyboardService = baseService.keyboardService;
        this.$$modalService = baseService.modalService;
        this.$$suiSpinService = baseService.suiSpinService;
        // this.$$rootElement.nativeElement.setAttribute("tabindex", "0");

    }


    private bindEvent(url: string) {
        this.initTabByUrl(url);
    }

    /**
     * 通过路径获取页签
     */
    private initTabByUrl(url: string) {

        
        this.tab = this.$$globalService.tabManager.getTabByUrl(url);
        if (!this.tab) {
            this.$$commonServices.logs.throwError(" open tab faile; tab is undefined", url);
        }
        this.initModuleRight();
        this.tab.tabContentLoadState = true;
        this.tab.focus = () => {
            this.focus();
        };
    }

    //第一次加载应用; body绑定菜单信息 moduleid与pageType 页面类型信息
    /*   private bodyBindTabInfo() {
          //第一次加载应用,将生产一个参数传递元素
          let tabEventDeliverEL = document.createElement(this.EL_TAB_INFO);
          let tabEventDeliverId = this.$$tabOuterUtil.getTabContentPageDataId(this.tab.moduleid, this.tab.attr);
          tabEventDeliverEL.title = tabEventDeliverId;
          this.$$commonServices.domHandler.appendChild(tabEventDeliverEL, document.body);
      } */

    /**
     * 初始化模块权限值
     */
    private initModuleRight() {
        this.mRight = this.getModuleRightById(this.tab.moduleid);
    }

    /**
     * 通过模块号,获取模块功能权限值
     * @param moduleId 
     * @returns ModuleFeatureRight 模块不存在则返回空
     */
    protected getModuleRightById(moduleId: number): ModuleFeatureRight {

        let menu: LeftMenu = this.$$globalService.tabManager.getLeftMenuByModuleId(moduleId);
        if (menu) {
            return this.$$moduleRightService.getMRights(menu.rightvalue);
        } else {
            return null;
        }

    }

    /**
     * 页面重新加载后,绑定事件,供外部调用
     */
    // private bindEventForOutInvoke() {
    //     let tabEventDeliverEL = document.createElement("span");
    //     let tabEventDeliverId = this.$$tabOuterUtil.getTabContentPageDataId(this.tab.moduleid, this.tab.attr);
    //     tabEventDeliverEL.id = tabEventDeliverId;
    //     this.$$commonServices.domHandler.appendChild(tabEventDeliverEL, this.$$rootElement.nativeElement);
    //     tabEventDeliverEL.addEventListener(tabEventDeliverId, (event: CustomEvent) => {
    //         this.outInvokeInterface(event.detail);
    //     }, false);
    // }

    /**
     * 外部调用接口
     * @param param 
     */
    private outInvokeInterface(param) {
        /* if (param.active == "ROUTE") {
            this.$$router.navigate(["/" + param.param.url]);
        } else  */
        if (param.active == "FOCUS") {
            this.focus();
        } else {
            this.focus();
        }
    }

    /**
     * 焦点定位
     */
    protected focus() {
        if (!this.defaultFoscuElement) {
            let defaultFocusEL = this.$$rootElement.nativeElement.querySelector("[defaultFocus]");
            defaultFocusEL = defaultFocusEL ? defaultFocusEL : this.$$rootElement.nativeElement.querySelector("[tabindex]");
            this.defaultFoscuElement = defaultFocusEL;
        }

        if (this.defaultFoscuElement) {
            this.$$keyboardService.fucos(this.defaultFoscuElement);
            // console.debug(" focus in the tab current is ",this.tab,this.CLASS_NAME, this.defaultFoscuElement);
            // defaultFocusEL.focus();
        } else {
            console.warn(" can't find any tabindex element in the page;can't use hotkey ");
        }
    }

    /**
     * 页面跳转
     * @param attr 操作类型: L-列表,A-新增,M-编辑,B-浏览
     * @param param 跳转需要参数
     * @param moduleId 模块号
     */
    protected goToPage(attr: string, param: any, moduleId?: number) {
        if (this.$$commonServices.classUtil.notExits(moduleId)) {
            moduleId = this.tab.moduleid;
        }
        if (this.$$commonServices.classUtil.notExits(attr)) {
            attr = this.tab.attr;
        }

        this.goToPageShare(attr, param, moduleId);

    }

    private goToPageShare(attr: string, param: any, moduleId?: number) {
        let tabEntryParam: TabEntryParam = {
            active: "OPEN",
            moduleId: moduleId,
            attr: attr,
            param: param
        };
        this.$$globalService.tabManager.tabOutInvokeEntry(tabEntryParam);
    }

    /**
     * 页面数据变动
     * 用于页面关闭需要提示
     */
    protected pageDataIsChange(moduleId?: number, attr?: string) {
        this.tab.dataChangeFlag = true;
    }

    /**
     * 恢复页面数据状态
     * 用于页面关闭不需要提示
     * 
     */
    protected restorePageData(moduleId?: number, attr?: string) {
        if (this.$$commonServices.classUtil.notExits(moduleId)) {
            moduleId = this.tab.moduleid;
        }
        if (this.$$commonServices.classUtil.notExits(attr)) {
            attr = this.tab.attr;
        }
        this.tab.dataChangeFlag = false;
    }

    /**
     * 切换或关闭页面是否需要询问关
     * @param attr 
     * @param param 
     * @param moduleId 
     * @param isCloseClickConfirm 是否关闭窗口,如果点击确定按钮;true-关闭, false - 页面切换
     * @returns true-询问; flase -不询问,直接关闭
     */
    private togglePageIsAsk(attr: string, param: any, moduleId: number, isCloseClickConfirm: boolean): boolean {
        let dataChangeFlag = this.tab.dataChangeFlag;
        if (dataChangeFlag) {
            this.$$modalService.modalConfirm("您的数据未保存,关闭将会丢失;您确定关闭?")
                .subscribe(backResult => {
                    if (backResult != "OK") {
                        return;
                    }
                    if (isCloseClickConfirm) {
                        //关闭窗口
                        this.forceClosePage(attr, param, moduleId);
                    } else {
                        //是否是页面切换
                        this.goToPageShare(attr, param, moduleId);
                    }
                })
        }
        return dataChangeFlag;
    }

    /**
     * 关闭页面 如果页面数据变化会询问
     * @param attr 操作类型: L-列表,A-新增,M-编辑,B-浏览
     * @param param 跳转需要参数
     * @param moduleId 模块号
     */
    protected closePage(attr?: string, param?: any, moduleId?: number) {
        if (this.$$commonServices.classUtil.notExits(moduleId)) {
            moduleId = this.tab.moduleid;
        }
        if (this.$$commonServices.classUtil.notExits(attr)) {
            attr = this.tab.attr;
        }

        // if(this.togglePageIsAsk(attr, param, moduleId,true)) {
        //     return ;
        // }

        this.forceClosePageShare(attr, param, moduleId);
    }

    /**
     * 强制关闭页面
     * @param attr 操作类型: L-列表,A-新增,M-编辑,B-浏览
     * @param param 跳转需要参数
     * @param moduleId 模块号
     */
    protected forceClosePage(attr?: string, param?: any, moduleId?: number) {
        if (this.$$commonServices.classUtil.notExits(moduleId)) {
            moduleId = this.tab.moduleid;
        }
        if (this.$$commonServices.classUtil.notExits(attr)) {
            attr = this.tab.attr;
        }
        //先设置数据无变化
        this.restorePageData(moduleId, attr);
        this.forceClosePageShare(attr, param, moduleId);
    }

    /**
     * 强制关闭
     * @param attr 
     * @param param 
     * @param moduleId 
     */
    private forceClosePageShare(attr: string, param: any, moduleId?: number) {
        let tabEntryParam: TabEntryParam = {
            active: "CLOSE",
            moduleId: moduleId,
            attr: attr,
            param: param
        };
        this.$$globalService.tabManager.tabOutInvokeEntry(tabEntryParam);
    }

    /**
     * 工具栏点击回调方法
     * 子类必须重新方法,规则为: do+toolbar.name(第一字母大写)
     * 例如按钮名称 name="edit"
     * 则方调用方法: doEdit(param, event);
     * @param event 
     */
    onToolBtnClick(event) {
        let utils = this.$$commonServices;
        let methodName = 'do' + utils.classUtil.firstCapital(event.active);
        this.dynamicInvokeMethod(methodName, event.param, event.originalEvent);

    }

    private dynamicInvokeMethod(methodName: string, ...params) {
        // try {
        if (typeof this[methodName] !== "function") {
            console.error(this.CLASS_NAME + ".%s(param,event) function undefined  ; if you don't need, remove the button from toolbar", methodName);
            return;
        }
        if (!Array.isArray(params)) {
            params = [params];
        }
        this[methodName].apply(this, params);
        // } catch (error) {
        //     console.error(this.CLASS_NAME + ".[%s] function undefined  ; if you don't need, remove the button from toolbar",methodName, error.stack);
        // }
    }

    /**
     * 返回列表
     * @param param 
     * @param originalEvent 
     */
    protected doList(param, originalEvent?) {
        this.goToPage(this.ATTR.L, null);
    }

    /**
     * 新增
     * @param originalEvent 
     */
    protected doAdd(param, originalEvent) {
        this.goToPage(this.ATTR.A, null);
    }

    /**
     * 获取结果
     * 1. param.entity 存在则,取其值
     * 2. param.entitys 数组 存在,则取序号0的值
     * 3. 上面两个都不存在;param存在,则取param的值
     * @param {any} param 
     * @returns 
     * @memberof BaseComponent
     */
    private getEntity(param) {
        if (!param) {
            return "";
        }
        if (param.entity) {
            return param.entity;
        }
        if (param.entitys) {
            return param.entitys[0];
        }
        return param;
    }

    protected doBrowse(param, originalEvent?) {
        let _param = {
            entity: this.getEntity(param)
        }
        this.goToPage(this.ATTR.B, _param);
    }

    protected doEdit(param, originalEvent?) {
        let _param = {
            entity: this.getEntity(param)
        }
        this.goToPage(this.ATTR.M, _param);
    }

    protected doPrint(param, originalEvent?) {
        console.debug(" the print function");
    }

    /**
     * 反审核
     * @param param 
     * @param event 
     */
    protected doCopy(param, event) {
        if (this.unChooseRecord(param)) {
            return;
        }
        let entitysLen: number = (param && param.entitys) ? param.entitys.length : 1;
        this.$$modalService.modalConfirm("您确定复制" + this.getOperPrompt(entitysLen))
            .subscribe((retCode: string): void => {
                this.focus();
                if (retCode != "OK") {
                    return;
                }
                this.dynamicInvokeMethod("doConfirmCopy", param, event);
            });
    }

    /**
     * 反审核
     * @param param 
     * @param event 
     */
    protected doReverseCheck(param, event) {
        if (this.unChooseRecord(param)) {
            return;
        }
        let entitysLen: number = (param && param.entitys) ? param.entitys.length : 1;
        this.$$modalService.modalConfirm("您确定要反审核" + this.getOperPrompt(entitysLen))
            .subscribe((retCode: string): void => {
                this.focus();
                if (retCode != "OK") {
                    return;
                }
                this.dynamicInvokeMethod("doConfirmReverseCheck", param, event);
            });
    }

    /**
     * 审核
     * @param param 
     * @param event 
     */
    protected doCheck(param, event) {
        if (this.unChooseRecord(param)) {
            return;
        }
        let entitysLen: number = (param && param.entitys) ? param.entitys.length : 1;
        this.$$modalService.modalConfirm("您确定要审核" + this.getOperPrompt(entitysLen))
            .subscribe((retCode: string): void => {
                this.focus();
                if (retCode != "OK") {
                    return;
                }
                this.dynamicInvokeMethod("doConfirmCheck", param, event);
            });
    }

    /**
     * 删除
     * @param param 
     * @param event 
     */
    protected doDel(param, event) {
        if (this.unChooseRecord(param)) {
            return;
        }
        let entitysLen: number = (param && param.entitys) ? param.entitys.length : 1;
        this.$$modalService.modalConfirm("您确定要删除" + this.getOperPrompt(entitysLen))
            .subscribe((retCode: string): void => {
                this.focus();
                if (retCode != "OK") {
                    return;
                }
                this.dynamicInvokeMethod("doConfirmDel", param, event);
            });
    }

    /**
     * 取消
     * @param param 
     * @param event 
     */
    protected doCancel(param, event) {
        if (this.unChooseRecord(param)) {
            return;
        }
        let entitysLen: number = (param && param.entitys) ? param.entitys.length : 1;
        this.$$modalService.modalConfirm("您确定要取消" + this.getOperPrompt(entitysLen))
            .subscribe((retCode: string): void => {
                this.focus();
                if (retCode != "OK") {
                    return;
                }
                this.dynamicInvokeMethod("doConfirmCancel", param, event);
            });
    }

    /**
     * 未选择记录 true-未选择,false - 已选择
     * @param param 
     * @param {boolean}  true-未选择,false - 已选择
     */
    protected unChooseRecord(param): boolean {
        //详情/编辑/新增,不需要参数也可以    
        if (this.tab.attr != "L") {
            return false;
        }
        if (!param.entitys || param.entitys.length == 0) {
            this.$$modalService.modalToast("请先选择记录");
            return true;
        }
        return false;
    }

    private getOperPrompt(recordNum: number): string {
        if (recordNum == 1) {
            return "该记录?";
        } else {
            return "这些记录?";
        }
    }


}