import { GlobalService } from './../../global/global.service';
import { SuiCookieService } from './../../services/storage/sui-cookie.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { CACHE_IDS } from '../../services/storage/cache-ids';
import { SuiLocalConfig } from '../../global/sui-local-config';
import { Application } from './sui-framework/application';
import { SuiRouterService, SuiRouterInfo } from '../../directives/router/sui-router.sevice';

/**
 * 配置信息
 */
export interface SuiSiteConfig {
    /**
     * 文件服务器地址
     */
    fileServerAddr:string;
    /**
     * 红包服务器地址
     */
    redpackServerAddr:string;
    /**
     * 打印与文件导出服务器地址
     */
    printerAndExportServerAddr: string;
    /**
     * 支付服务器地址
     */	
    payServerAddr:string;
    /**
     * 消息中心路径
     */
    msgCentercServerAddr:string;
    /**
     * 当前访问应用
     */
    currentApp: Application ;
}

/**
 * 用户信息
 */
export interface SuiUser {
    loginName: string,
    telePhone: string,
    realName: string,
    // fileServerAddr: string,
    qq: string,
    email: string,
    eid: number,
    userId: number,
    /**
     * 企业全称
     */
    fullname: string,
    ename: string,
}
/**
 * @author liurong
 * @create date 2017-11-29 11:57:54
 * @modify date 2017-11-29 11:57:54
 * @desc 客户端缓存数据服务
*/
@Injectable()
export class ClientSessionDataService {

    constructor(
        private storage: SuiCookieService,
        private suiRouter: SuiRouterService,
        private globalService: GlobalService
    ) {
        this.globalService.clientSessionData = this;
    }

    /**
     * 检查登录 满足两个条件即可
     * 1. session.user存在
     * 2. cookie.token存在
     * 
     * @returns {boolean} 
     * @memberof ClientSessionDataService
     */
    checkLogin(): boolean {
        let user: SuiUser = this.getUserInfo();
        // console.log(">>>user", user);
        if (!user) {
            return false;
        }
        let token = this.storage.get(this.getTokenName(user.loginName));
        // console.log(">>>token", token, this.getTokenName(user.loginName));
        if (!token) {
            return false;
        }
        return true;
    }

    /**
     * 缓存用户
     * 
     * @memberof ClientSessionDataService
     */
    cacheUserInfo(user: SuiUser): void {
        this.storage.putLocal(this.getUserKeyName(user.loginName), user);
    }

    /**
     * 获取用户信息
     * 
     * @memberof ClientSessionDataService
     */
    getUserInfo(): SuiUser {
        let loginName: string = this.storage.getSession(CACHE_IDS.SESSION_LOGINNAME);
        return this.storage.getLocal(this.getUserKeyName(loginName));
    }

    /**
     * 清除登录信息
     * 
     * @memberof ClientSessionDataService
     */
    clearLoginInfo() {
        let user: SuiUser = this.getUserInfo();
        if (user) {
            let tokeName: string = this.getTokenName(user.loginName);
            this.storage.removeSession(CACHE_IDS.SESSION_CONFIG);
            this.storage.removeSession(CACHE_IDS.SESSION_LOGINNAME);
            this.storage.remove(tokeName);
            this.storage.removeLocal(this.getUserKeyName(user.loginName));
            this.storage.removeLocal(tokeName);
        }
    }

    /**
     * 缓存token 
     * loginame: 支持多用户登录
     * 
     * @memberof ClientSessionDataService
     */
    cacheToken(token: string, loginName: string): void {
        let tokeName: string = this.getTokenName(loginName);
        this.storage.put(tokeName, "LOCAL");
        //token太长,放cookie 发起http请求时,会传到服务器
        this.storage.putLocal(tokeName, token);
        this.storage.putSession(CACHE_IDS.SESSION_LOGINNAME, loginName);
    }


    /**
     * 获取用户信息
     * 
     * @memberof ClientSessionDataService
     */
    getToken(): string {
        let user: SuiUser = this.getUserInfo();
        if (!user) {
            return null;
        }
        let tokeName: string = this.getTokenName(user.loginName);
        return this.storage.getLocal(tokeName);
    }


    /**
    * 缓存应用配置信息
    * 
    * @memberof ClientSessionDataService
    */
    cacheSuiSiteConfig(configInfo: SuiSiteConfig): void {
        this.storage.putSession(CACHE_IDS.SESSION_CONFIG, configInfo);
    }

    /**
     * 新浏览器页签初始化缓存
     * 
     * @memberof ClientSessionDataService
     */
    newBrowserTagInitCache() {
        let loginName: string = this.storage.getSession(CACHE_IDS.SESSION_LOGINNAME);
        //已缓存
        if(loginName) {
            return ;
        }
        if(this.globalService.getSuiLocalConfig().MULT_USER_FLAG === true) {
            let routerInfo: SuiRouterInfo = this.suiRouter.getUrlBylocation();
             if(routerInfo && routerInfo.queryParams) {
                loginName = routerInfo.queryParams.localkey;
             }
            
        } else {
            //不支持多用户登录
            loginName = "";
        }
        this.storage.putSession(CACHE_IDS.SESSION_LOGINNAME, loginName);
    }


    /**
     * 获取配置信息
     * 
     * @memberof ClientSessionDataService
     */
    getSuiSiteConfig(): SuiSiteConfig {
        return this.storage.getSession(CACHE_IDS.SESSION_CONFIG);
    }

    /**
    * 获取 缓存在 cookie token的key值
    * 
    * @private
    * @param {string} loginName 
    * @returns 
    * @memberof ClientSessionDataService
    */
    private getTokenName(loginName: string): string {
        if (this.globalService.getSuiLocalConfig().MULT_USER_FLAG !== false) {
            return `token_${loginName}`;
        } else {
            return "token";
        }
    }


    /**
    * 获取缓存用户信息在localStorage 的key值
    * 
    * @private
    * @param {string} loginName 
    * @returns 
    * @memberof ClientSessionDataService
    */
    private getUserKeyName(loginName: string): string {
        let preFix = CACHE_IDS.SESSION_LOGINNAME;
        if (this.globalService.getSuiLocalConfig().MULT_USER_FLAG !== false) {
            return `${preFix}_${loginName}`;
        } else {
            return `${preFix}`;
        }
    }



}