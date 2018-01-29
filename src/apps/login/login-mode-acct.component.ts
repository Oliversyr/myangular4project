import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { TopCommon } from './../../common/top-common/top-common';
import { LoginService } from './login.service';
import { SuiValidator, ValidatorRule } from '../../common/components/validator/sui-validator';
import { BaseService } from '../../common/top-common/base.service';

@Component({
    selector: 'login-mode-acct',
    templateUrl: './login-mode-acct.html',
    styleUrls: ['./login.scss']
})
export class LoginModeAcctComponent extends TopCommon implements OnInit {

    /** 是否显示帮助信息 */
    showHelpQuestion: boolean = false;

    /** 自动登录提示信息 */
    autoLoginTooltipContent = '勾选后7天内自动登录';

    /** 获取企业配置信息 */
    enterpriseInfo: any = {};

    /** 用户登录信息 */
    @Input() userInfo: any = {};

    @Output() doLogin = new EventEmitter();
    @Output() doForgetPsd = new EventEmitter();

    @ViewChild("el_validator") el_validator: SuiValidator;
    rootValidators: ValidatorRule[];

    constructor(private loginService: LoginService, private baseService: BaseService) {
        super();
    }

    ngOnInit() {
        this.enterpriseInfo = this.loginService.enterpriseInfo;
        setTimeout(() => {
            this.initValidator();
        }, 0);
    }

    /** 忘记密码 */
    doForgetAcctPsd() {
        let message = `请联系管理员或客服：${this.enterpriseInfo.hotline}`,
            title = '找回密码',
            msgType = 'info';
        this.baseService.modalService.modalAlert(message, title, msgType).subscribe((retCode: string): void => {

        });
    }

    /** 登录 */
    doAcctLogin() {
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
                input: '#userEidAccount',
                message: '企业编号必填!',
                action: 'keyup, blur',
                rule: 'required'
            },
            {
                input: '#userEidAccount',
                message: '请输入8位的企业编号!',
                action: 'keyup, blur',
                rule: (input: any, commit: any): any => {
                    let reg = /^\d{8}$/,
                        val = input.val(),
                        result = reg.test(val);
                    return result;
                }
            },
            {
                input: '#userAccount',
                message: '账号必填!',
                action: 'keyup, blur',
                rule: 'required'
            },
            {
                input: '#userAccount',
                message: '请输入长度为3-12的账号',
                action: 'keyup, blur',
                rule: 'length=3,12'
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
