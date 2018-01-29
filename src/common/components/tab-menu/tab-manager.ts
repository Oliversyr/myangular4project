import { CommonServices } from './../../services/groups/common-services.module';
import { SuiRouterService } from './../../directives/router/sui-router.sevice';
import { TabMenuComponent } from './tab-menu.component';
// import { Router } from '@angular/router';
import { TabContentPage, ContentPageParam } from './tab-content-page';
import { TabOuterUtil } from './tab-outer-util';
import { TabUtil } from './tab-util';
import { TAB_ACTIVE, TabEntryParam } from './tab-entry.param';
import { DomSanitizer } from '@angular/platform-browser';

import { Menu, } from './menu';
import { Tab } from './tab';
import { TabMenuInput } from './tab-menu.input';
import { LeftMenu } from './left-menu';
import { ModalService } from '../modal/modal.service';
import { ATTR } from '../../top-common/attr';

/**
 * @author
 * 页签管理类
 */
export class TabManager {

    private CLASS_NAME: string = "TabManager";
    //左侧菜单
    leftMenus: LeftMenu[];
    //打开的页签
    tabs: Tab[];
    //当前选中页签
    currentTab: Tab;
    //当前活动的页签序号
    activeIndex: number;
    private domSanitizer: DomSanitizer;
    //路由前缀
    private menuRouterPrefix: string;

    private moudleParam: any = {};
    private tabUtil: TabUtil;
    private tabOuterUtil: TabOuterUtil;
    private tabContentPage: TabContentPage;
    private suiRouter: SuiRouterService;
    private modal: ModalService;
    private utils: CommonServices;
    //默认打开菜单
    defaultOpenModuleId: number;
    // private router: SuiRouterService;


    /*  constructor(
         domSanitizer: DomSanitizer,
         tabs: Tab[],
         private tabUtil: TabUtil,
         private tabOuterUtil: TabOuterUtil ,
         private tabContentPage: TabContentPage,
         private router?: Router
     ) { 
         this.domSanitizer = domSanitizer ;
         this.tabs = tabs ;
     } */

    constructor(
        private tabMenuComponent: any
    ) {
        this.domSanitizer = this.tabMenuComponent.domSanitizer;
        this.tabs = this.tabMenuComponent.tabs;
        this.tabUtil = this.tabMenuComponent.tabUtil;
        this.tabOuterUtil = this.tabMenuComponent.tabOuterUtil;
        this.tabContentPage = this.tabMenuComponent.tabContentPage;
        this.suiRouter = this.tabMenuComponent.suiRouter;
        this.suiRouter = this.tabMenuComponent.suiRouter;
        this.modal = this.tabMenuComponent.modal;
        this.utils = this.tabMenuComponent.utils;
    }

    tabOutInvokeEntry(param: TabEntryParam) {
        if (typeof param.active === "string") {
            param.active = TAB_ACTIVE[param.active];
        }
        let attr: string;
        if (typeof param.attr !== "string") {
            attr = ATTR[param.attr];
        } else {
            attr = param.attr;
        }
        if (param.active == TAB_ACTIVE.OPEN) {
            //打开页签
            this.openMenuByModuleId(param.moduleId, attr, param.param);
        } else if (param.active == TAB_ACTIVE.CLOSE) {
            //关闭页签
            this.closeTabByModuleId(param.moduleId, attr);
        } else if (param.active == TAB_ACTIVE.SHOW) {
            //显示页签
            let tabIndex = this.getTabIndexByModuleId(param.moduleId, attr);
            this.tabChange(tabIndex);
        }
    }

    // setMenus(menus: Menu[], defaultOpenModuleId?: number) {
    //     this.leftMenus = this.tranMenus(menus); 
    //     if(defaultOpenModuleId) {
    //         this.openMenuByModuleId(defaultOpenModuleId);  
    //     }

    // }

    setTabMenuInput(tabMenuInput: TabMenuInput) {
        this.menuRouterPrefix = !tabMenuInput.menuRouterPrefix ? "/" : tabMenuInput.menuRouterPrefix;
        this.defaultOpenModuleId = this.tranMenus(tabMenuInput.menus);
        /* if (defaultOpenModuleId) {
            // setTimeout(() => {
            this.openMenuByModuleId(defaultOpenModuleId);
            // }, 200);
        }
 */
    }

    /**
     * 1. 菜单转换
     * 2. 返回默认打开的菜单id
     * @param menus 
     * @returns defaultOpenModuleId 不存在怎返回第一个菜单
     */
    tranMenus(menus: Menu[]): number {
        // console.debug(">>>>>>>>>>>menus", menus);
        let leftMenus = [];
        let newMenu, defOpenModuleId: number = -1;
        for (let menu of menus) {
            newMenu = this.getNewLeftMenu(menu, 1);
            newMenu.childrens = [];
            leftMenus.push(newMenu);
            if (menu.childrens && menu.childrens.length > 0) {
                for (let subMenu of menu.childrens) {
                    //如果设置 多个默认打开菜单;则第一个菜单生效
                    if (defOpenModuleId == -1 && subMenu.isDefOpen === true) {
                        defOpenModuleId = subMenu.moduleid;
                    }
                    newMenu.childrens.push(this.getNewLeftMenu(subMenu));
                }
            }
        }
        this.leftMenus = leftMenus;
        // console.debug(">>>>>>>>>>leftMenus", this.leftMenus);
        if (defOpenModuleId === -1) {
            //没有定义则默认第一个
            if (menus[0].childrens) {
                defOpenModuleId = menus[0].childrens[0].moduleid;
            } else {
                defOpenModuleId = menus[0].moduleid;
            }

        }
        return defOpenModuleId;
    }

    private getNewLeftMenu(originMenu: Menu, level?: number) {
        let iconUrl = "assets/imgs/menus/" + originMenu.moduleid + ".png";
        // console.debug(">>>>>>>>>>originMenu.isLeftMenuHiden",originMenu.isLeftMenuHiden,originMenu);
        return new LeftMenu(originMenu.moduleid, originMenu.modulename, iconUrl, originMenu.url, originMenu.rightvalue,null,originMenu.isLeftMenuHiden);
    }

    tabChange(e: Event | number) {
        if (typeof e === "number") {
            this.activeIndex = e;
        } else {
            this.activeIndex = (e as any).index;
        }

        if (this.activeIndex == this.tabs.indexOf(this.currentTab)) {
            console.debug(".....click the crrent tab , nothing todo");
            if(this.utils.classUtil.isFunction(this.currentTab.focus)) {
                this.currentTab.focus();
            }
            return;
        }

        this.toggleTab();
        this.expandLeftMenuByModuleId(this.currentTab.moduleid);
        this.togglePageByRoute(this.currentTab.safeUrl, this.currentTab.routerParam);
    }

    /**
     * 展开左侧菜单
     * @param moduleId 
     */
    private expandLeftMenuByModuleId(moduleId: number) {
        var parentMenu = this.getParentMenuByModuleId(moduleId);
        //展开
        if (parentMenu && !parentMenu.isExpand) {
            parentMenu.isExpand = true;
        }
    }

    /**
     * 通过菜单模块号关闭页签
     * @param moduleId 
     */
    closeTabByModuleId(moduleId: number, attr?: string) {
        moduleId = this.getDefModuleIdWhenEmpty(moduleId);
        var tabIndex = this.getTabIndexByModuleId(moduleId, attr);
        if (tabIndex == -1) {
            alert("模块号为[" + moduleId + "]菜单不存在,无法关闭");
            return;
        }
        this.closeTabByIndex(tabIndex);

    }

    /**
     * 页签切换通用方法
     * 来源: 1. 做菜单点击切换 2.顶部页签点击
     */
    private toggleTab() {
        this.currentTab = this.tabs[this.activeIndex];
        this.tabs.map((tab, index) => {
            tab.selected = this.activeIndex == index;
        });
    }


    closeTabByIndex(tabIndex: number) {
        /* if (tabIndex == 0 || this.tabs.length == 1) {
            alert("第一个页签不允许关闭");
            return;
        } */

        if (this.togglePageIsAsk(tabIndex)) {
            return;
        }

        this.closeTabByIndexShare(tabIndex);
    }

    /**
     * 获取页签模块参数
     * @param moduleId  
     * @param attr 界面类型:L-列表 B-详情
     * @param param 参数
     * @returns 返回参数
     */
    getDataChangeFlag(moduleId: number, attr: string): boolean {
        let param = this.getParamByModuleId(moduleId, attr);
        if (param) {
            return param.dataChangeFlag === true;
        } else {
            return false;
        }
    }


    /**
     * 切换或关闭页面是否需要询问关
     * @param tabIndex 页签序号
     * @param e 事件
     * @returns true-询问; flase -不询问
     */
    private togglePageIsAsk(tabIndex: number, message?: string, okMethod?: (...param) => void): boolean {
        message = message ? message : "关闭";
        if (!okMethod) {
            okMethod = this.closeTabByIndexShare;
        }
        let closeTab = this.tabs[tabIndex];
        let dataChangeFlag = closeTab.dataChangeFlag;
        if (dataChangeFlag) {
            var backResult = this.modal.modalConfirm(`您的数据未保存,${message}将会丢失;您确定关闭?`)
                .subscribe(backResult => {
                    if (backResult === "OK") {
                        okMethod(tabIndex);
                    } else {
                        this.tabChange(tabIndex);
                    }
                });
        }
        return dataChangeFlag;
    }

    private closeTabByIndexShare = (tabIndex: number, e?: any): void => {
        let closeTab = this.tabs[tabIndex];
        this.tabParamManager(TAB_ACTIVE.CLOSE, closeTab.moduleid, this.getPageType(closeTab.attr));
        //关闭的窗口为当前窗口;打开前一个页签
        if (closeTab == this.currentTab) {
            this.activeIndex = tabIndex == 0 ? 0 : tabIndex - 1;
            this.toggleTab();
            this.togglePageByRoute(this.currentTab.safeUrl, this.currentTab.routerParam);
        }
        this.tabs.splice(tabIndex, 1);
    }

    /**
     * 通过模块号打开页签
     * @param moduleId 菜单模块号,不传去当前模块号
     * @param attr 操作类型 L-列表 A-新增,B-浏览,M-修改
     * @param param 传递给当前页签的参数
     */
    openMenuByModuleId(moduleId?: number, attr?: string, param?: any) {
        if (!moduleId) {
            moduleId = this.currentTab.moduleid;
        }
        if (!moduleId) {
            alert("模块号不存在");
            return;
        }
        let menu = this.getLeftMenuByModuleId(moduleId);
        if (menu == null) {
            alert("菜单不存在无法打开");
            return;
        }
        this.openMenu(menu, attr, param);
    }

    openMenu(menu: LeftMenu, attr?: string, param?: any) {
        attr = attr ? attr : "L";
        let tabIndex: number = this.getTabIndexByModuleId(menu.moduleid, attr);

        //是否为新加载
        // let isNewLoad: boolean = false;
        let isNewTab: boolean;
        if (tabIndex == -1) {
            this.tabs.push(this.getNewTab(menu, attr));
            tabIndex = this.tabs.length - 1;
            isNewTab = true;
            this.doConfirmOpenMenu(menu, tabIndex, isNewTab, attr, param);
            return;
        }
        isNewTab = false;
        //覆盖页面,如果页面数据发生变化,则需要询问客户是否覆盖
        //详情页面,但是有浏览切换到编辑,需要跳转 暂时不考虑
        //1. 详情-->编辑;页面数据变化;必须询问是否放弃修改 暂时不考虑
        //2. 编辑-->编辑;参数改变;必须询问是否放弃修改 暂时不考虑
        if (this.togglePageIsAsk(tabIndex, "替换", (tabIndex) => {
                this.tabs[tabIndex].dataChangeFlag = false;
                this.doConfirmOpenMenu(menu, tabIndex, isNewTab, attr, param);
            })) {
                return;
            }
        this.doConfirmOpenMenu(menu, tabIndex, isNewTab, attr, param);
    }

    private doConfirmOpenMenu(menu: LeftMenu, tabIndex: number, isNewTab: boolean, attr?: string, param?: any) {
        if (isNewTab !== true) {
            //不是新页签
            let pageType = this.getPageType(attr);
            let openTab: Tab = this.tabs[tabIndex];
            if (pageType == "B"
                && this.tabOuterUtil.getPageRouterSuffix(openTab.attr) != this.tabOuterUtil.getPageRouterSuffix(attr)) {
                openTab.safeUrl = this.getUrl(menu.url, attr);

            }
        }
        this.expandLeftMenuByModuleId(menu.moduleid);
        // setTimeout(() => {
        this.activeIndex = tabIndex;
        this.toggleTab();
        //路由参数放在页签中
        this.currentTab.routerParam = param;
        //走路由
        this.togglePageByRoute(this.currentTab.safeUrl, param);
        if (this.currentTab && this.currentTab.attr != attr) {
            //浏览/编辑/新增共享一个页签
            this.currentTab.attr = attr;
        }
    }

    /**
     * 调用内容页面接口,刷新数据
     * @param moduleId 
     * @param attr 
     * @param param 
     */
    private flushContentPageParam(moduleId: number, attr: string, param?) {
        let contentPageParam: ContentPageParam = {
            moduleId: moduleId,
            attr: attr,
            active: "DELIVER_PARAM",
            param: param
        }
        //引起内存泄漏
        this.tabContentPage.invokeContentPage(contentPageParam);
    }

    /**
     * 通过内容页面的路由切换页面
     * @param moduleId 
     * @param attr 
     * @param url 
     */
    // private togglePageByRoute(moduleId: number, attr: string, url: string, param?: any) {
    private togglePageByRoute(url: string, param?: any) {
        this.suiRouter.navigate(url, param);
        if(this.utils.classUtil.isFunction(this.currentTab.focus)) {
            setTimeout( () => {
                this.currentTab.focus();
            },5)
        }

        /* let contentPageParam: ContentPageParam = {
            moduleId: moduleId,
            attr: attr,
            active: "ROUTE",
            param: { url: url }
        }
        //页签走路由的话, 加载页面时间短,会造成页签还没渲染, 子页面内容已经加载; 初始化有问题
        setTimeout(() => {
            this.tabContentPage.invokeContentPage(contentPageParam);
        }, 10) */
    }

    private getNewTab(leftMenu: LeftMenu, attr: string) {
        // return new Tab(leftMenu.moduleid, leftMenu.modulename, this.getSaleUrl(leftMenu, attr), attr);
        return new Tab(leftMenu.moduleid, leftMenu.modulename, this.getUrl(leftMenu.url, attr), attr);
    }

    private getSaleUrl(leftMenu: LeftMenu, attr: string) {
        let safeUrl;
        if (leftMenu.url.startsWith("http")) {
            safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(leftMenu.url);
        } else {
            safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.getUrl(leftMenu.url, attr));
        }

        return safeUrl;
    }

    private getUrl(menuUrl: string, attr: string): string {
        let url: string = this.menuRouterPrefix + menuUrl + this.getPageRouterSuffix(attr);
        return url;
    }


    /**
     * 通过操作类型获取界面类型
     * @param attr 操作类型
     * @returns 返回页面类型 B-详情 A/M-/编辑/新增;L-浏览
     */
    private getPageRouterSuffix(attr: string) {
        return this.tabOuterUtil.getPageRouterSuffix(attr);
    }


    /**
     * 通过操作类型获取界面路由后缀
     * @param attr 
     * @returns 返回页面类型 B-detail;L-空串
     */
    getPageType(attr: string) {
        return this.tabOuterUtil.getPageType(attr);
    }

    getTabIndexByModuleId(moduleId: number, attr: string) {
        let pageType = this.getPageType(attr);
        for (let index = 0; index < this.tabs.length; index++) {
            if (this.tabs[index].moduleid == moduleId
                && (this.getPageType(this.tabs[index].attr) == this.getPageType(attr))) {
                return index;
            }
        }
        return -1;
    }

    /**
     * 通过模块号与操作类型获取页签
     * @param moduleId 
     * @param attr 
     * @returns Tab 不存在返回空
     */
    getTabByModuleId(moduleId: number, attr: string): Tab {
        let pageType = this.getPageType(attr);
        for (let index = 0; index < this.tabs.length; index++) {
            if (this.tabs[index].moduleid == moduleId
                && (this.getPageType(this.tabs[index].attr) == this.getPageType(attr))) {
                return this.tabs[index];
            }
        }
        return null;
    }

    /**
     * 通过路径获取页签
     * @param url 
     */
    getTabByUrl(url: string): Tab {
        let tabUrl;
        url = this.tabOuterUtil.urlFormatToDetailOrList(url);
        /* if(url.endsWith("edit")) {
            url = url.replace(/(.*)edit/, '$1detail');
        } else if(url.endsWith("add")){
            url = url.replace(/(.*)add/, '$1detail');
        } */
        for (let index = 0; index < this.tabs.length; index++) {
            // tabUrl = (this.tabs[index].safeUrl as any).changingThisBreaksApplicationSecurity;
            tabUrl = this.tabs[index].safeUrl;
            tabUrl = this.tabOuterUtil.urlFormatToDetailOrList(tabUrl);
            /* if(tabUrl.endsWith("edit")) {
                tabUrl = tabUrl.replace(/(.*)edit/, '$1detail');
            }else if(tabUrl.endsWith("add")){
                tabUrl = tabUrl.replace(/(.*)add/, '$1detail');
            } */
            if (url.endsWith(tabUrl)) {
                return this.tabs[index];
            }
        }
        return null;
    }

    getLeftMenuByModuleId(moduleId: number): LeftMenu {
        for (let menu of this.leftMenus) {
            if (menu.moduleid == moduleId) {
                return menu;
            }
            for (let subMenu of menu.childrens) {
                if (subMenu.moduleid == moduleId) {
                    return subMenu;
                }
            }
        }
        return null;
    }

    getLeftMenuByUrl(url: string): LeftMenu{
        if(!url) {
            return null ;
        }
        url = this.tabOuterUtil.getMenuUrlByUrl(url, this.menuRouterPrefix);
        for (let menu of this.leftMenus) {
            if (menu.url == url) {
                return menu;
            }
            for (let subMenu of menu.childrens) {
                if (subMenu.url == url) {
                    return subMenu;
                }
            }
        }
        return null;
    }

    /**
     * 焦点定位到当前页面
     * 
     * @memberof TabManager
     */
    focusCurrentTabPage() {
        if(!this.currentTab) {
            return ;
        }
        this.currentTab.focus();
/* 
        let tabIndex: number = this.getTabIndexByModuleId(this.currentTab.moduleid, this.currentTab.attr);
        let myFrame = this.tabMenuComponent.iframes.find((iframe, index) => index == tabIndex);
        let myFrame_doc = myFrame ? myFrame.nativeElement.contentWindow.document : document;
        this.tabOuterUtil.focus(myFrame_doc, this.currentTab.moduleid, this.currentTab.attr);
         */
    }

    /**
     * 获取模块的父模块
     * @param moduleId 
     */
    getParentMenuByModuleId(moduleId: number) {
        for (let menu of this.leftMenus) {
            for (let subMenu of menu.childrens) {
                if (subMenu.moduleid == moduleId) {
                    return menu;
                }
            }
        }
        return null;
    }

    /**
    * 页签参数操作
    * @param tab_active  TAB_ACTIVE OPEN-打开设置参数,CLOSE-关闭清除参数
    * @param moduleId 
    * @param pageType 
    * @param param 
    */
    tabParamManager(tab_active: TAB_ACTIVE, moduleId: number, attr: string, param?: any) {
        if (tab_active == TAB_ACTIVE.OPEN) {
            this.setModuleParam(moduleId, this.getPageType(attr), param);
        } else if (tab_active == TAB_ACTIVE.CLOSE) {
            this.clearParamByModuleId(moduleId, this.getPageType(attr));
        }
    }

    /**
     * 获取当前模块id 当模块号为空的时候,返回当前打开的模块号
     * @param moduleId  模块号
     * @return moduleId 当前模块id
     */
    private getDefModuleIdWhenEmpty(moduleId: number): number {
        if (!moduleId) {
            return this.currentTab.moduleid;
        }
        return moduleId;
    }

    /**
     * 设置页签模块参数
     * @param moduleId  
     * @param pageType 界面类型:L-列表 B-详情
     * @param param 参数
     */
    setModuleParam(moduleId: number, attr: string, param?: any) {
        // if(!param) {
        //     return ;
        // }
        this.moudleParam[this.getDefModuleIdWhenEmpty(moduleId) + this.getPageType(attr)] = param;
    }

    /**
     * 获取页签模块参数
     * @param moduleId  
     * @param pageType 界面类型:L-列表 B-详情
     * @param param 参数
     * @returns 返回参数
     */
    getParamByModuleId(moduleId: number, attr: string): any {
        return this.moudleParam[this.getDefModuleIdWhenEmpty(moduleId) + this.getPageType(attr)];
    }

    /**
     * 测试使用,查看模块参数
     */
    getMoudleParam() {
        return this.moudleParam;
    }

    /**
     * 清空参数,释放内存
     * @param moduleId  
     * @param pageType 界面类型:L-列表 B-详情
     */
    clearParamByModuleId(moduleId: number, attr: string) {
        this.moudleParam[this.getDefModuleIdWhenEmpty(moduleId) + this.getPageType(attr)] = null;
    }

    destroy() {
        this.moudleParam = null;
    }


    /************页签************ */


}