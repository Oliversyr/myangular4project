import { GlobalService } from './../common/global/global.service';
import { RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
 
/**
 * liurong
 * 解决bug：
 * Error: Cannot reattach ActivatedRouteSnapshot created from a different route
 */
export class SuiReuseStrategy implements RouteReuseStrategy {
 

    globalService: GlobalService;
    handlers: { [key: string]: DetachedRouteHandle } = {};
    private sameKeys: { [key: string]: string } = {};

    /**
     * 移除不合理的url缓存 
     * 1. 当前页签不打开的
     */
    private clearValidateUrlCache() {
        if(!this.globalService || !this.globalService.tabManager) {
            return ;
        }
        let tabs = this.globalService.tabManager.tabs;
        let tabUrls: string[] = tabs.map(tab => this.getPageUrlBySameUrl(tab.safeUrl));
        // console.debug(">>>>>>>>>before-clearValidateUrlCache", tabUrls, this.sameKeys,this.handlers);
        //已关闭的页签,不需要缓存
        for (let key in this.sameKeys) {
            if (tabUrls.length == 0 || tabUrls.indexOf(key) == -1) {
                delete this.handlers[this.sameKeys[key]];
                delete this.sameKeys[key];
                continue;
            }
        }
        // console.debug(">>>>>>>>>after-clearValidateUrlCache", tabUrls, this.sameKeys,this.handlers);
    }

    /**
     * 删除相同路径,但是参数不同的缓存
     */
    private deleteSamlePathUrlCache(url: string, sameUrl: string) {
        delete this.handlers[this.sameKeys[sameUrl]];
        delete this.sameKeys[sameUrl];
    }

    private getSamleUrlByUrl(orignUrl: string): string {
        let sameUrl: string;
        sameUrl = orignUrl.split(";")[0];
        sameUrl = sameUrl.split("?")[0];
        if (sameUrl[0] == "/") {
            sameUrl = sameUrl.substring(1);
        }

        return this.getPageUrlBySameUrl(sameUrl);
        
    }

    private getPageUrlBySameUrl(sameUrl: string) {
        if(!this.globalService || !this.globalService.tabManager) {
            return sameUrl;
        }
        //详情/编辑/新增同享一个界面
        return this.globalService.tabManager["tabOuterUtil"].urlFormatToDetailOrList(sameUrl)
    }

    calcKey(route: ActivatedRouteSnapshot) {
        let url = route['_routerState'].url;
        return url;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        //console.debug('CustomReuseStrategy:shouldDetach', route);
        return true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        // console.debug(">>>>>>>>>>route", route);
        this.clearValidateUrlCache();
        let url = this.calcKey(route);
        let sameUrl = this.getSamleUrlByUrl(url);
        this.deleteSamlePathUrlCache(url, sameUrl);
        this.sameKeys[sameUrl] = url;
        this.handlers[url] = handle;
        // console.debug('CustomReuseStrategy:store', url, sameUrl, this.sameKeys, this.handlers);

    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        //console.debug('CustomReuseStrategy:shouldAttach', route);
        return !!route.routeConfig && !!this.handlers[this.calcKey(route)];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        //console.debug('CustomReuseStrategy:retrieve', route);
        if (!route.routeConfig) return null;
        return this.handlers[this.calcKey(route)];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        //console.debug('CustomReuseStrategy:shouldReuseRoute', future, curr);
        return this.calcKey(curr) === this.calcKey(future);
    }


}