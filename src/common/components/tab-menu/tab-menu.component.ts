import { EnterpriseInfo } from './../../global/sui-local-config';
import { GlobalService } from './../../global/global.service';
import { ModalService } from './../modal/modal.service';
import { Router } from '@angular/router';
import { TopCommon } from './../../top-common/top-common';
import { TabContentPage, ContentPageParam } from './tab-content-page';
import { TabOuterUtil } from './tab-outer-util';
import { TabUtil } from './tab-util';
import { LeftMenu } from './left-menu';
import { TabEntryParam, TAB_ACTIVE } from './tab-entry.param';
import { CommonServices } from './../../services/groups/common-services.module';
import { Component, OnInit, OnDestroy, Input, ViewChild, Renderer2, ContentChild, TemplateRef } from '@angular/core';
import { ContentChildren, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Tab } from './tab';
import { TabManager } from './tab-manager';
import { Menu } from './menu';
import { TabMenuInput } from './tab-menu.input';

import { ATTR } from "../../../common/top-common/attr";
import { SuiRouterService } from '../../directives/router/sui-router.sevice';
import { Application } from '../../business-components/sui-frameworks/sui-framework/application';
import { ClientSessionDataService } from '../../business-components/sui-frameworks/client-session-data.service';

@Component({
    selector: "sui-tab-menu",
    templateUrl: './tab-menu.component.html',
    styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent extends TopCommon implements OnInit, OnDestroy {

    /**
     * 是否显示路由标志
     */
    @Input() displayRouterOutletFlag: boolean ;

    @ViewChild('el_tabInvoke') el_tabInvoke: ElementRef;
    @ViewChildren("iframe") iframes: QueryList<ElementRef>;

    @ContentChild('appContent') appContent: TemplateRef<any>;

    currentApp: Application;
    enterpriseInfo: EnterpriseInfo;
    

    
    tabManager: TabManager;
    tabs: Tab[] = [];
    tabContentLoadMessage: string = "加载中...";

    /**
     * 菜单是否收起来
     */
    isCollapsed: boolean = false;
    

    constructor(
        public domSanitizer: DomSanitizer,
        private globalService: GlobalService,
        private clientSessionData: ClientSessionDataService,
        public tabUtil: TabUtil,
        public tabOuterUtil: TabOuterUtil,
        public tabContentPage: TabContentPage,
        public utils: CommonServices,
        public suiRouter: SuiRouterService,
        public modal: ModalService
    ) {
        super();
         
    }

    ngOnInit() {
        this.currentApp= this.clientSessionData.getSuiSiteConfig().currentApp;
        this.enterpriseInfo= this.globalService.getSuiLocalConfig().ENTERPRISE_INFO;
        // this.tabManager = new TabManager(this.domSanitizer, this.tabs, this.tabUtil, this.tabOuterUtil, this.tabContentPage, this.router);
        this.tabManager = new TabManager(this);
        this.tabContentPage.setTabManager(this.tabManager);
        this.setAppGlobalTabInvokeCfg();
    }

    ngAfterViewInit() {
    }

    /**
     * 收缩菜单
     */
    toggleCollapsed() {
        this.isCollapsed = !this.isCollapsed;
    }

    /**
     * 设置全局页签调用配置文件
     */
    private setAppGlobalTabInvokeCfg() {
        this.globalService.tabManager = this.tabManager ;

    }
 
    /**
     * 一级菜单收缩事件
     * @param {LeftMenu}menu 
     * @param {boolean}isExpand 是否展开 
     */
    menuLv1OpenChange(menu: LeftMenu, isExpand) {
        menu.isExpand = isExpand;
    }

    closeTab(tabIndex, tab: Tab) {
        this.tabManager.closeTabByIndex(tabIndex);
    }

    openMenu(menu: LeftMenu) {
        this.tabContentPage.setIframes(this.iframes);
        this.tabManager.openMenu(menu);
        return false;
    }

    tabChange(index, tab: Tab) {
        // console.debug(">>>>>>tabChange, index, tab", index, tab);
        this.tabManager.tabChange(index);
        /* //焦点定位
        let contentPageParam: ContentPageParam = {
            moduleId: tab.moduleid,
            attr: tab.attr,
            active: "FOCUS"
            // ,param: 
        }
        this.tabContentPage.setIframes(this.iframes);
        this.tabContentPage.invokeContentPage(contentPageParam); */
    }


    @Input() set tabMenus(tabMenus: TabMenuInput) {
        if (tabMenus && tabMenus.menus && tabMenus.menus.length != 0) {
            this.tabManager.setTabMenuInput(tabMenus);
        }
    }

    ngOnDestroy() {
        this.tabManager = null ;
    }
}