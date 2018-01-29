import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie";


/**
 * @author liurong
 * @date 2017-11-18
 * @notes 浏览缓存管理:
 * 包含: sessionStorage,COOKIE,localStorage
 */
@Injectable()
export class SuiCookieService extends CookieService {

    /**
     * 设置 sessionStorage 值
     * 
     * @param {(string | number)} key 
     * @param {*} data 
     * @memberof SuiCookieService
     */
    putSession(key: string | number, data: any) {
        data = data || "" ;
        sessionStorage.setItem(key + "", JSON.stringify(data));
    }

    /**
     * 移除 sessionStorage 值
     * 
     * @param {(string | number)} key 
     * @memberof SuiCookieService
     */
    removeSession(key: string | number) {
        sessionStorage.removeItem(key + "");
    }

    /**
     * 获取 sessionStorage 值
     * 
     * @param {(string | number)} key 
     * @memberof SuiCookieService
     */
    getSession(key: string | number) {
        let value = sessionStorage.getItem(key + "");
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
        
    }

    /**
     * 清除 sessionStorage 所有值
     * 
     * @memberof SuiCookieService
     */
    removeAllSession() {
        sessionStorage.clear();
    }

    /**
     * 设置 localStorage 值
     * 
     * @param {(string | number)} key 
     * @param {*} data 
     * @memberof SuiCookieService
     */
    putLocal(key: string | number, data: any) {
        data = data || "" ;
        localStorage.setItem(key + "", JSON.stringify(data));
    }

    /**
     *移除 localStorage 值
     * 
     * @param {(string | number)} key 
     * @memberof SuiCookieService
     */
    removeLocal(key: string | number) {
        localStorage.removeItem(key + "");
    }

    /**
     * 获取 localStorage 值
     * 
     * @param {(string | number)} key 
     * @returns 
     * @memberof SuiCookieService
     */
    getLocal(key: string | number) {
        let value = localStorage.getItem(key + "");
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }

    /**
     * 清除所有 localStorage
     * 
     * @memberof SuiCookieService
     */
    removeAllLocal() {
        localStorage.clear();
    }

}