import { Injectable } from '@angular/core';
import {
    CanActivate, 
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    NavigationExtras,
    CanLoad, 
    Route
} from '@angular/router';
// import { LoginService } from './login.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(/* private loginService: LoginService, */ private router: Router) { }

    /** 用CanActivate来处理导航到某路由的情况 */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    /** 用CanActivateChild来处理导航到某子路由的情况。 */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    /** 用CanLoad来处理异步导航到某特性模块的情况。 */
    canLoad(route: Route): boolean {
        let url = `/${route.path}`;
        return this.checkLogin(url);
    }

    /** 检查是否已经登录 */
    checkLogin(url: string): boolean {
        /* if (this.loginService.isLoggedIn) { return true; }

        // 存储试图重定向的URL
        this.loginService.redirectUrl = url;

        // 创建一个虚拟会话ID
        let sessionId = 123456789;

        // 我们的导航的额外对象包含我们的全局查询参数和片段
        let navigationExtras: NavigationExtras = {
            queryParams: { 'session_id': sessionId },
            fragment: 'anchor'
        };

        // 使用附加导航到登录页面
        this.router.navigate(['/login'], navigationExtras);
        return false; */
        return false;
    }
}