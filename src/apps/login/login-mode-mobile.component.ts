import { Component, Input, OnInit, Output, EventEmitter, ViewChild, AfterViewInit, AfterContentInit, OnChanges } from '@angular/core';
import { TopCommon } from './../../common/top-common/top-common';
import { LoginService } from './login.service';
import { SuiValidator, ValidatorRule } from '../../common/components/validator/sui-validator';
import { UserInfo } from './login-mode.component';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'login-mode-mobile',
    templateUrl: './login-mode-mobile.html',
    styleUrls: ['./login.scss']
})
export class LoginModeMobileComponent extends TopCommon {

    /** 是否显示帮助信息 */
    showHelpQuestion: boolean = false;

    /** 自动登录提示信息 */
    autoLoginTooltipContent = '勾选后7天内自动登录';

    /** 获取企业配置信息 */
    enterpriseInfo: any = {};

    /** 用户登录信息 */
    @Input() userInfo: any;

    @Output() doLogin = new EventEmitter();
    @Output() doForgetPsd = new EventEmitter();

    @ViewChild("el_validator") el_validator: SuiValidator;
    rootValidators: ValidatorRule[];

    constructor(private loginService: LoginService) {
        super();
    }

    ngOnInit() {
        this.enterpriseInfo = this.loginService.enterpriseInfo;
        setTimeout(() => {
            this.initValidator();
        }, 0);
    }

    /** 忘记密码 */
    doForgetMobilePsd() {
        this.doForgetPsd.next(this.userInfo);
    }

    /** 登录 */
    doMobileLogin() {
        this.el_validator.pass().subscribe(isPass => {
            if (!isPass) {
                return;
            }
            this.doLogin.next(this.userInfo);
        })
    }

    /** 校验规则 */
    private initValidator(): void {
        this.rootValidators = [
            {
                input: '#userMobile',
                message: '手机号必填!',
                action: 'keyup, blur',
                rule: 'required'
            },
            {
                input: '#userMobile',
                message: '请输入正确的手机号!',
                action: 'keyup, blur',
                rule: (input: any, commit: any): any => {
                    let reg = /^1[34578]\d{9}$/,
                        val = input.val(),
                        result = reg.test(val);
                    return result;
                }
            },
            {
                input: '#userPswd',
                message: '密码必填!',
                action: 'keyup, blur',
                rule: 'required'
            },
            {
                input: '#userPswd',
                message: '请输入长度为3-16的密码!',
                action: 'keyup, blur',
                rule: 'length=3,16'
            }
        ];
    }
}
