import { SuiLocalConfig, BaseFrameworkConfig } from './../../common/global/sui-local-config';
import { GlobalService } from './../../common/global/global.service';
import { CommonServices } from './../../common/services/groups/common-services.module';
import { ClientSessionDataService, SuiUser, SuiSiteConfig } from './../../common/business-components/sui-frameworks/client-session-data.service';
import { Router } from '@angular/router';
import { Component, ViewChild, ViewContainerRef, ComponentRef, ComponentFactory, ComponentFactoryResolver, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { TopCommon } from './../../common/top-common/top-common';
import { LoginService } from './login.service';
import { SuiCookieService } from './../../common/services/storage/sui-cookie.service';
import { LoginModeAcctComponent } from './login-mode-acct.component';
import { LoginModeMobileComponent } from './login-mode-mobile.component';
import { ForgetMobilePasswordComponent } from './forget-mobile-password.component';

export interface UserInfo {
    eid: string,
    loginName: string,
    pswd: string,
    devType: string,
    isAutoLogin: boolean,
    loginType: string,
    errorMessage: string
}

@Component({
    selector: 'login-mode',
    templateUrl: './login-mode.html',
    styleUrls: ['./login.scss']
})
export class LoginModeComponent extends TopCommon implements OnInit, OnDestroy {

    componentRef: ComponentRef<any>;

    /** 基础框架配置信息 */
    baseFrameworkConfig: BaseFrameworkConfig ;

    /** 用户登录信息 */
    userInfo: UserInfo = {
        eid: '',
        loginName: '',
        pswd: '',
        devType: 'PC',
        isAutoLogin: false,
        loginType: 'mobile',
        errorMessage: ''
    };

    /** 加载层 */
    loadSpin: any = {
        isOpen: false,
        message: '登录中...'
    };

    @ViewChild("loginModeContainer", { read: ViewContainerRef }) container: ViewContainerRef;
    @ViewChild('el_forgetMobilePassword') el_forgetMobilePassword: ForgetMobilePasswordComponent;

    constructor(private loginService: LoginService, private storage: SuiCookieService, private resolver: ComponentFactoryResolver, private router: Router
        , private clientSessionData: ClientSessionDataService
        , private globalService: GlobalService
        , private utils: CommonServices
    ) {
        super();
    }

    ngOnInit() {
        let suiLocalConfig: SuiLocalConfig = this.globalService.getSuiLocalConfig();
        this.baseFrameworkConfig= suiLocalConfig.BASE_FRAMEWORK_CONFIG;
        if(this.clientSessionData.checkLogin()) {
            //如果已经登录,直接进入首页
            this.goToMain();
            return ;
        }
        this.switchLoginType(this.storage.getLocal('loginType') || 'mobile');
    }

    ngOnDestroy() {
        this.componentRef.destroy();
    }

    /** 创建登录模式视图 */
    createLoginModeComponent(type) {
        this.container.clear();
        const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(type);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.userInfo = this.userInfo;
        this.componentRef.instance.doLogin.subscribe((userInfo: any) => {
            this.doLogin(userInfo);
        });
        this.componentRef.instance.doForgetPsd.subscribe((userInfo: any) => {
            this.doForgetPsd(userInfo);
        });
    }

    /** 登录方式切换 */
    switchLoginType(loginType: string) {
        this.userInfo.loginType = loginType;
        this.userInfo.pswd = '';
        if (loginType === 'mobile') {
            this.userInfo.eid = '';
            this.userInfo.loginName = this.storage.getLocal('tele') || '';
            this.createLoginModeComponent(LoginModeMobileComponent);
        } else {
            this.userInfo.eid = this.storage.getLocal('eid') || '';
            this.userInfo.loginName = this.storage.getLocal('name') || '';
            this.createLoginModeComponent(LoginModeAcctComponent);
        }
    }

    /** 登录 */
    doLogin(userInfo: any) {
        let _userInfo = Object.assign({}, userInfo, {
            pswd: '0x' + Md5.hashStr(userInfo.pswd)
        });
        // console.debug('>>>>......do login: ', _userInfo);
        this.loadSpin.isOpen = true;
        this.loginService.doLogin(_userInfo).subscribe(response => {
            this.loadSpin.isOpen = false;
            if (response.retCode !== 0) {
                this.userInfo.errorMessage = "登录失败: " + response.message;
                return;
            } else {
                this.onAfterLoginSuccess(response.data.result);
                /* // 根据返回的数据缓存配置信息
                let data = response.result;
                this.loginService.setLoggedCookies(data, _userInfo);

                // 设置 登录状态
                this.loginService.isLoggedIn = true;

                // 路由跳转到 基础应用中心
                window.location.href = this.baseFrameworkConfig.defaultAppUrl || '';
                // this.router.navigate(['apps-center']); */
            }
        });
    }

    /**
     * 登录成功
     */
    private onAfterLoginSuccess(data: any) {
        let user: SuiUser = this.utils.classUtil.clone(data, ["telePhone", "realName", /* "fileServerAddr", */ "qq", "email", "loginEid", "userId", "fullname", "ename"]) as SuiUser;
        user = Object.assign({}, user, this.userInfo, {
            pswd: '0x' + Md5.hashStr(this.userInfo.pswd)
        });
        this.clientSessionData.cacheUserInfo(user);
        let token: string = data.idToken;
        this.clientSessionData.cacheToken(token, this.userInfo.loginName);
        this.goToMain();
    }

    private goToMain() {
        let url: string = this.baseFrameworkConfig.defaultAppUrl || '' ;
        window.location.href = '#/'+url;
        window.location.reload();
    }

    /** 忘记密码 */
    doForgetPsd(userInfo: any) {
        this.el_forgetMobilePassword.open();
    }
}