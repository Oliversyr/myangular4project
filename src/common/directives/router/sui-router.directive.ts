import { SuiRouterService } from './sui-router.sevice';
import { NgModule } from '@angular/core';
/**
 * @author liurong
 * @create date 2017-11-28 09:59:14
 * @modify date 2017-11-28 10:01:24
 * @desc 
 * 自定义路由link 指令 
 * 1. 增加param 参数
 * 2. param 参数支持多级对象 传递,例如: param = {a:123,sheetId:123,items:[{....}]}
 * 3. 参数加密
*/
import { RouterLinkWithHref } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { Attribute, Directive, ElementRef, HostBinding, HostListener, Input, OnChanges, OnDestroy, Renderer2, isDevMode } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UrlTree, ActivatedRoute, Router,  RouterLink } from '@angular/router';

@Directive({ selector: ':not(a)[suiRouterLink]' })
export class SuiRouterLinkDirective extends RouterLink {
    /* @Input() param: any;

    @Input("suiRouterLink")
    set routerLink(commands: any[] | string) {
        if (commands != null) {
            this["commands"] = Array.isArray(commands) ? commands : [commands];
        } else {
            this["commands"] = [];
        }
    }

    constructor(
        router: Router, 
        route: ActivatedRoute, 
        tabIndex: string, 
        renderer: Renderer2, 
        el: ElementRef,
        private routerService: SuiRouterService
    ){
        super(router,route,tabIndex,renderer,el);
    }

    get urlTree(): UrlTree {
        if (this.param) {
            let param = {param: null};
            param.param = this.param
            if (typeof this.param === "object") {
                param.param  = JSON.stringify(this.param);
            } else {
                param.param  = this.param;
            }
            param.param = this.routerService.encryp(param.param);
            let len = this["commands"].length; 
            if (typeof this["commands"][len-1] === "object") {
                this["commands"][len-1] = param;
            }else {
                this["commands"].push(param);
            }
            // this.queryParams = Object.assign(this.queryParams || {}, param)
        }
        return this["router"].createUrlTree(this["commands"], {
            relativeTo: this["route"],
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this["preserve"]),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment),
        });
    }
 */
}


@Directive({ selector: 'a[suiRouterLink]' })
export class SuiRouterLinkWithHrefDirective extends RouterLinkWithHref {

   /*  @Input() param: any;

    @Input("suiRouterLink")
    set routerLink(commands: any[] | string) {
        if (commands != null) {
            this["commands"] = Array.isArray(commands) ? commands : [commands];
        } else {
            this["commands"] = [];
        }
    }

    constructor(
        router: Router, 
        route: ActivatedRoute, 
        locationStrategy: LocationStrategy,
        private routerService: SuiRouterService
    ){
        super(router,route,locationStrategy);
    }

    get urlTree(): UrlTree {
        if (this.param) {
            let param = {param: null};
            param.param = this.param
            if (typeof this.param === "object") {
                param.param  = JSON.stringify(this.param);
            } else {
                param.param  = this.param;
            }
            param.param = this.routerService.encryp(param.param);
            let len = this["commands"].length; 
            if (typeof this["commands"][len-1] === "object") {
                this["commands"][len-1] = param;
            }else {
                this["commands"].push(param);
            }
            // this.queryParams = Object.assign(this.queryParams || {}, param)
        }
        return this["router"].createUrlTree(this["commands"], {
            relativeTo: this["route"],
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this["preserve"]),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment),
        });
    } */


}


function attrBoolValue(s: any): boolean {
    return s === '' || !!s;
}
