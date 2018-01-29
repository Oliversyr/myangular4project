import { RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SuiHttpConfig } from './../../../services/https/sui-http-config';
import { CommonServices } from './../../../services/groups/common-services.module';
import { SuiLocalConfig, BaseFrameworkConfig } from './../../../global/sui-local-config';
import { ClientSessionDataService, SuiSiteConfig, SuiUser } from './../client-session-data.service';
import { TabOuterUtil } from './../../../components/tab-menu/tab-outer-util';
import { SuiRouterService } from './../../../directives/router/sui-router.sevice';
import { Application } from './application';
import { SuiFrameworkService } from './sui-framework.service';
import { Component, AfterViewInit, OnInit, OnDestroy, TemplateRef, ContentChild, Inject, Input } from '@angular/core';
import { TabMenuInput } from '../../../components/tab-menu/tab-menu.input';
import { ModalService } from '../../../components/modal/modal.service';
import { Menu } from '../../../components/tab-menu/menu';
import { GlobalService } from '../../../global/global.service';
import { SUI_HTTP_CONFIG } from '../../../services/https/sui-http-config';
/**
 * @author liurong
 * @create date 2017-11-29 11:58:47
 * @modify date 2017-11-29 11:58:47
 * @desc 基础框架组件
*/
@Component({
    selector: 'sui-framework',
    templateUrl: 'sui-framework.html',
    styleUrls: [
        'sui-framework.scss'
    ]
})
export class SuiFrameworkComponent implements OnInit, AfterViewInit, OnDestroy {

    tabMenus: TabMenuInput;

    apps: Application[];

    /** 基础框架配置信息 */
    baseFrameworkConfig: BaseFrameworkConfig;
    displayRouterOutletFlag: boolean;

    currentApp: Application;

    private user: SuiUser;

    private currentRouteInfo;

    constructor(
        private utils: CommonServices,
        private modal: ModalService,
        private myService: SuiFrameworkService,
        private suiRouter: SuiRouterService,
        private tabOuterUtil: TabOuterUtil,
        private clientSession: ClientSessionDataService,
        private globalService: GlobalService,
        @Inject(SUI_HTTP_CONFIG) suiHttpConfig: SuiHttpConfig
    ) {
        // suiHttpConfig.businessHeaders = suiHttpConfig.businessHeaders || {};
        suiHttpConfig.businessHeaders.Authorization = this.clientSession.getToken();
        // suiHttpConfig.businessHeaders["content-type"] = "application/json";
    }



    ngOnInit() {

        this.baseFrameworkConfig = this.globalService.getSuiLocalConfig().BASE_FRAMEWORK_CONFIG;
        this.user = this.globalService.clientSessionData.getUserInfo();
        this.loadData();
    }


    ngAfterViewInit() {

    }

    ngOnDestroy() {

    }

    /**
     * 切换应用
     */
    toggleApp(app) {
        window.location.href = app.url;
    }


    private loadData() {
        this.loadApps();

    }

    private loadApps() {
        this.initRouterInfoByUrl();
        if (!this.currentRouteInfo) {
            this.modal.modalAlert("请求路径不合理,无法根据路径获取路由信息").subscribe(() => {
                this.globalService.goToLoginPage();
            });
            return;
        }
        let appName: string = this.currentRouteInfo.url.split("/")[0];
        if (!appName) {
            this.modal.modalAlert("请求路径不合理;无法获取应用名").subscribe(() => {
                this.globalService.goToLoginPage();
            });
            return;
        }
        let param = {
            appid: -1
        };
        this.myService.getAppList(param).subscribe(res => {
            if (res.retCode != 0) {
                this.modal.modalConfirm(`加载应用失败;<br>点击"确定"请重试;<br>点击"取消"退出`).subscribe(resultCode => {
                    if (resultCode == "OK") {
                        //重试
                        this.loadApps();
                    } else {
                        this.globalService.goToLoginPage();
                    }
                });
                return;
            }
            let data = res.data;
            let config: SuiSiteConfig = data.config || {};

            data.result.map((app: Application) => {
                this.initApp(app);
            });
            this.apps = data.result;
            this.currentApp = this.apps.find(app => app.appname == appName);
            if (!this.currentApp) {
                this.utils.logs.throwError(" can't find the appName=[%s] in apps ", appName, this.apps);
            }
            config.currentApp = this.currentApp;
            this.clientSession.cacheSuiSiteConfig(config);
            this.currentApp["active"] = true;
            // setTimeout(() => {
            this.loadMenus();
            // },5000 )
        });
    }

    private tranAppTarget(app: Application) {
        let _target: number = parseInt(app.target);
        switch (_target) {
            case 1:
                app.target = "_blank";
                break;
            case 3:
                app.target = "_parent";
                break;
            case 4:
                app.target = "_top";
                break;
            case 5:
                app.target = "framename";
                break;
            case 2:
            default:
                app.target = "_self";
                break;
        }
    }

    private getQueryParamPrex(appurl: string): string {
        return appurl.indexOf("?") == -1 ? "?" : "&";
    }

    private initApp(app: Application) {
        this.tranAppTarget(app);
        if (app.appurl == app.appname) {
            //本应用内调整
            app.appurl = '#/' + app.appurl;
            if (this.globalService.getSuiLocalConfig().MULT_USER_FLAG == true) {
                //支持多用户
                app.appurl += this.getQueryParamPrex(app.appurl) + "localkey=" + this.user.loginName;
                }
        } else {
            /** 第三方跳转的时候需要携带用户包括登录信息 */
            if (app.target === "_blank") {
                let params: any = {}
                Object.assign(params, this.user, app);
                let _params: string = this.suiRouter.encryp(JSON.stringify(params));
                app.appurl += this.getQueryParamPrex(app.appurl) + "params=" + _params;
            }
        }

    }

    private initRouterInfoByUrl(): void {
        this.currentRouteInfo = this.suiRouter.getUrlBylocation();
        // console.log(">>>>>this.currentRouteInfo", this.currentRouteInfo);
    }

    private loadMenus() {

        let appName = this.currentApp.appname;
        let param = {
            appid: this.currentApp.appid,
            //需要传递给接口平台
            appName: appName
        };
        let menusObsers = [this.myService.getModuleList(param)];
        if (this.globalService.getSuiLocalConfig().HAS_STATICMENU_APPS.indexOf(appName) != -1) {
            let staticParam = {
                url: `base-framework/menus-${appName}` + ".static.json",
                rootPath: this.globalService.getSuiLocalConfig().RESOURCE_SERVER_ROOTPATH,
                method: RequestMethod.Get,
            };
            menusObsers.push(this.myService.getStaticMenus(staticParam));
        }
        Observable.forkJoin(menusObsers).subscribe(results => {
            let res = results[0];
            try {
                if (res.retCode != 0 || !res.data.result ||
                    !Array.isArray(res.data.result.moduleList) || res.data.result.moduleList.length == 0) {
                    this.modal.modalConfirm(`加载应用菜单失败,原因:<br>网络链接异常或者无访问权限,请联系管理员<br>点击"确定"请重试;<br>点击"取消"退出`).subscribe(resultCode => {
                        if (resultCode == "OK") {
                            //重试
                            this.loadMenus();
                        } else {
                            this.globalService.goToLoginPage();
                        }
                    });
                    return;
                }
                let menuList = res.data.result.moduleList;
                let istree = res.data.result.istree;
                let menus = istree == 1 ? menuList : this.transTreeData(menuList);
                if (results[1] && results[1].data && results[1].data.result) {
                    this.initStaticMenus(menus, results[1].data.result.moduleList);
                }
                this.setAppMenus(menus, appName);
            } catch (error) {
                console.error("load menu err", error);
                this.modal.modalConfirm(`加载应用菜单失败;<br>点击"确定"请重试;<br>点击"取消"退出`).subscribe(resultCode => {
                    if (resultCode == "OK") {
                        //重试
                        this.loadMenus();
                    } else {
                        this.globalService.goToLoginPage();
                    }
                });
                return;
            }

        });
    }

    private setAppMenus(menus: Menu[], appName: string) {
        this.tabMenus = {
            menus: menus,
            menuRouterPrefix: `${appName}/`,
        };
        this.openMenuByUrl(appName);
    }

    private openMenuByUrl(appName: string) {
        setTimeout(() => {
            this.displayRouterOutletFlag = true;
            let openMenu = this.globalService.tabManager.getLeftMenuByUrl(this.currentRouteInfo.url);
            // console.log(">>>openMenu",openMenu,this.currentRouteInfo.url);
            if (!openMenu) {
                //打开默认菜单
                this.globalService.tabManager.openMenuByModuleId(this.globalService.tabManager.defaultOpenModuleId);
                return;
            }
            let attr: string = this.tabOuterUtil.getAttrByUrl(this.currentRouteInfo.url);
            let param: any;
            if (this.currentRouteInfo.param && this.currentRouteInfo.param.param) {
                param = this.suiRouter.decrypt(this.currentRouteInfo.param.param);
            }
            /*  //页签已打开
             let tabIndex: number= this.globalService.tabManager.getTabIndexByModuleId(openMenu.moduleid,attr);
             if(tabIndex != -1) {
                 return ;
             } */
            //需要清除缓存 临时方案
            // param = param || { t: Math.random().toString(32).slice(2, 6) };
            this.globalService.tabManager.openMenu(openMenu, attr, param);
        }, 2000);
    }

    /**
     * 初始化静态菜单
     */
    private initStaticMenus(menus: Array<any>, staticMenus: Array<any>) {
        if (this.utils.arrayUtil.isEmpty(menus) || this.utils.arrayUtil.isEmpty(staticMenus)) {
            return;
        }
        let menu: any, pmenu: any;
        for (let staticMenu of staticMenus) {
            if (this.utils.classUtil.toInt(staticMenu.parentmoduleid) <= 0) {
                //一级菜单
                menu = this.getMenuByMid(menus, staticMenu.moduleid);
                if (menu == null) {
                    //菜单不存在
                    menus = menus.concat(staticMenu);
                } else {
                    //菜单存在;仅仅复制二级菜单
                    menu.childrens = menu.childrens.concat(staticMenu.childrens);
                }
            } else {
                //非一级菜单,则查找其上级菜单
                pmenu = this.getMenuByMid(menus, staticMenu.parentmoduleid);
                if (menu == null) {
                    //上级菜单不存在; 静态菜单无效
                    this.utils.logs.throwError(`上级菜单[${staticMenu.parentmoduleid}]不存在; 静态菜单无效`, menus, staticMenu);
                } else {
                    //上级菜单存在;复制
                    menu.childrens = menu.childrens.concat(staticMenu);
                }
            }
        }
    }

    private getMenuByMid(menus: Array<any>, moduleid: number): any {
        for (let menu of menus) {
            if (menu.moduleid == moduleid) {
                return menu;
            }
        }
    }

    // 将后台数据转换成树形结构数据
    private transTreeData(data) {
        let pid = 0; //根据业务规则定：pid=0，为最上层节点 ，即无父节点
        if (data.length > 0) {
            var curPid = pid;
            var parent = this.findChildNode(data, curPid);
            return parent;
        } else {
            return [];
        }
    }

    //找子节点
    private findChildNode(data, curPid) {
        let _arr = [],
            items = data,
            length = items.length;
        for (let i = 0; i < length; i++) {
            if (items[i].parentmoduleid == curPid) {
                var _obj = items[i];
                _obj.childrens = this.findChildNode(data, _obj.moduleid);
                _arr.push(_obj);
            }
        }
        return _arr;
    }

}
