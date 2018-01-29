import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { NgModule, Injectable } from '@angular/core';
import { RouterLinkWithHref, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute,  /*NavigationEnd,  */RouterLink,UrlTree,UrlSegmentGroup, PRIMARY_OUTLET } from '@angular/router';
/**
 * @author liurong
 * @create date 2017-11-28 09:59:14
 * @modify date 2017-11-28 10:14:15
 * @desc 
 * 自定义路由服务
 * 1. 包含路由业务信息
 * 2. param 参数支持多级对象 传递,例如: param = {a:123,sheetId:123,items:[{....}]}
 * 3. 参数加密
*/

export interface SuiRouterInfo{
    /**
     * 路由路径
     */
    url: string,
    /**
     * 路由参数
     * ;sheetId=1232;....
     */
    param: any,
    /**
     * url参数?sheetid=2&....
     */
    queryParams: any
}

@Injectable()
export class SuiRouterService {

    constructor(
        private router: Router,
        private activetedRoute: ActivatedRoute
    ) {

    }

    /**
     * 加密url参数
     * @param str 
     */
    encryp(str: string): string {
        if (str) {
            return btoa(encodeURIComponent(str));
        }
        return null;
    }

    /**
     * 解密url参数
     * @param encrypStr
     */
    decrypt(encrypStr: string): string {
        if (encrypStr) {
            return decodeURIComponent(atob(encrypStr));
        }
        return null;
    }

    /**
     * 自定义路由,功能如下
     * 1. param 参数自动json序列化
     * 2. param 序列化后进行加密
     * 3. param 加密后统一放在参数param传递
     * 
     * @param url 
     * @param param 
     */
    navigate(url: string, param: any) {
        let paramStr: string;
        if (!param) {
            this.router.navigate([url]);
            return;
        }
        if (typeof param === "object") {
            paramStr = JSON.stringify(param);
        } else {
            paramStr = param;
        }
        //加密
        paramStr = this.encryp(paramStr);
        this.router.navigate([url, { param: paramStr }]);
    }

    /**
     * 根据url获取当前路由信息
     * 1. orignUrl 路由地址;默认为 this.router.url
     * 2. isSecondaryOutlet  是否为次级路由 暂时无效; 扩展使用
     * 3. returns {
     *      1. url: -路由url
     *      1. param: 路由参数 
     *      1. queryParams: 路由参数 ?后面的
     *      1. }
     * @param orignUrl 
     * @param isSecondaryOutlet 
     * @returns {object}
     */
    getRouterInfo(orignUrl?: string, isSecondaryOutlet?: boolean): SuiRouterInfo{
        if(!orignUrl) {
            orignUrl = this.router.url;
        } 
        let result: SuiRouterInfo = {
            url: "",
            param: null,
            queryParams: null 
        }
        try {
            let tree: UrlTree = this.router.parseUrl(orignUrl);
            if(!tree) {
                return result;
            }
            result.queryParams = tree.queryParams
            let urlSegmentGroup: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
            if(!urlSegmentGroup) {
                return result;
            }
            let urlSegments: UrlSegment[] = urlSegmentGroup.segments;
            if(urlSegmentGroup) {
                 let urls: string[] = urlSegments.map(seg => seg.path);
                 result.url = urls.join("/");
                 result.param = urlSegments[urlSegments.length-1].parameters;
            }
        } catch (err) {
            console.error(">>>>err", err.stack, `orignUrl=[${orignUrl}]`);
        }

        return result ;
    }

    /**
     * 获取当前路由参数
     */
    getRouterParam(): any {
        return this.getRouterParamByUrl(null);
    }

    /**
     * 根据路径获取路由参数
     * @param url 
     */
    getRouterParamByUrl(url: string): any {
        let routerInfo = this.getRouterInfo(url);
        let params = routerInfo.param;
        let param = params["param"];
        try {
            param = JSON.parse(this.decrypt(params["param"]));
        } catch (error) {
        }
        return param;
    }

    /**
     * 获取当前路由的url
     * 1. url 默认取当前路径
     */
    getRouterUrl(): string {
        return this.getRouterInfo(null).url;
    }

    /**
     * 根据href获取路由路径
     * 1. url 默认取当前路径
     * @param url 
     */
    getUrlBylocation(): SuiRouterInfo {
        let hash: string = window.location.hash ;
        let routerUrl: string = hash.replace('#/','');
        let routerInfo = this.getRouterInfo(routerUrl);
        return routerInfo;
    }

}

