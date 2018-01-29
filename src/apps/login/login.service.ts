import { SuiLocalConfig, EnterpriseInfo } from './../../common/global/sui-local-config';
import { Injectable } from '@angular/core';
import { SuiHttpService } from './../../common/services/https/sui-http.service';
import { SuiCookieService } from './../../common/services/storage/sui-cookie.service';
import { Observable } from 'rxjs/Observable';
import { UserInfo } from './login-mode.component';
import { GlobalService } from '../../common/global/global.service';
import { ClientSessionDataService } from '../../common/business-components/sui-frameworks/client-session-data.service';


@Injectable()
export class LoginService {
    // 用来标识是否用户已经登录过了
    isLoggedIn = false;

    // 存储URL，这样我们可以在登录后重定向。
    redirectUrl: string;

    // 企业配置信息
    enterpriseInfo: EnterpriseInfo ;

    constructor(private httpUtils: SuiHttpService, 
        private storage: SuiCookieService,
        private clientSessionData: ClientSessionDataService, 
        private globalService: GlobalService
    ) {
        this.enterpriseInfo = this.globalService.getSuiLocalConfig().ENTERPRISE_INFO;
    }

    /** 登录 */
    doLogin(userInfo: any) {
        let option = {
            url: 'api/authenticate/login',
            rootPath: this.globalService.getSuiLocalConfig().BUSINESS_ROOTPATH,
            isPublish: true,
            bodyParam: {
                eid: userInfo.eid || '',
                pswd: userInfo.pswd || '',
                loginName: userInfo.loginName || '',
                devType: userInfo.devType || 'PC'
            }
        }
        return this.httpUtils.request(option);
    }

    /** 前端 登出 */
    fedLogOut() {
        return new Observable((observer) => {
            this.clientSessionData.clearLoginInfo();
            this.globalService.goToLoginPage();
            observer.next('SUCCESS');
        });
    }

    /** 获取验证码 */
    getVCode(mobilePhone) {
        let option = {
            url: "/authenticate/vcode",
            type: 'get',
            isPublish: true,
            bodyParam: {
                mobilePhone: mobilePhone || ''
            }
        }
        return this.httpUtils.request(option);
    }

    /** 发送验证码 */
    sendVCode(mobile) {
        let option = {
            url: "/business/sms/sendcode",
            type: 'get',
            isPublish: true,
            bodyParam: {
                mobile: mobile || ''
            }
        }
        return this.httpUtils.request(option);
    }

    /** 校验验证码 */
    checkVCode(mobile, checkCode) {
        let option = {
            url: "/business/sms/checkcode",
            type: 'get',
            isPublish: true,
            bodyParam: {
                mobilePhone: mobile || '',
                checkCode: checkCode || ''
            }
        }
        return this.httpUtils.request(option);
    }

    /** 忘记密码 */
    resetPwsd(mobile, vcode, newPwsd) {
        let option = {
            url: "/orgm/user/pwsd/reset",
            type: 'get',
            isPublish: true,
            bodyParam: {
                mobile: mobile || '',
                vcode: vcode || '',
                newPwsd: newPwsd || ''
            }
        }
        return this.httpUtils.request(option);
    }


    /** 设置Cookie过期天数 */
    /* setCookieExpires(days: number): Date {
        let d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        return d;
    } */

    /** 缓存Cookie */
    setLoggedCookies(data: any, userInfo: UserInfo): void {
         let options = Object.assign({}, data, userInfo);
/*         
        // 设置 token 的Cookie失效日期，默认一天
        this.storage.put('Authorization-Token', data.idToken, { expires: this.setCookieExpires(1) });

        // 设置 用户信息 的Cookie失效日期
        if (options.isAutoLogin) {
            this.storage.putObject('User_Info', data, { expires: this.setCookieExpires(7) });
        } else {
            this.storage.putObject('User_Info', data, { expires: this.setCookieExpires(1) });
        }
 */
        // 设置 登录账号、登录方式 、企业编号 的Cookie
        this.storage.putLocal('loginType', options.loginType);
        if (options.loginType === 'mobile') {
            this.storage.putLocal('tele', options.loginName);
        } else {
            this.storage.putLocal('eid', options.eid);
            this.storage.putLocal('name', options.loginName);
        }    
    }
}