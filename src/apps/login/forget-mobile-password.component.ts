import { Md5 } from 'ts-md5/dist/md5';
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy, Input, DoCheck, AfterContentInit } from '@angular/core';
import { TopCommon } from './../../common/top-common/top-common';
import { HOTKEYS } from './../../common/directives/keyboard/hotkeys';
import { Modal } from './../../common/components/modal/modal';
import { SuiValidator, ValidatorRule } from '../../common/components/validator/sui-validator';
import { LoginService } from './login.service';

/**
 *  个人手机号登录：忘记密码弹出框
 */
@Component({
    selector: 'forget-mobile-password',
    templateUrl: './forget-mobile-password.html',
    styleUrls: ['./forget-mobile-password.scss']
})
export class ForgetMobilePasswordComponent extends TopCommon implements OnInit {

    hotkeys: any = HOTKEYS;

    /** 找回密码表单信息 */
    forgetPasswordForm = {
        phone: '',
        vCode: '',
        password: '',
        confirmPassword: '',
        errorMessage: ''
    }

    /** 倒计时时间 */
    time: number = 60;

    /** 倒计时是否开始 */
    countStart: boolean = false;

    /** 倒计时验证码文字 */
    vCodeBtnText: string = '获取验证码';

    /** 加载层 */
    loadSpin: any = {
        isOpen: false,
        message: '提交中...'
    };

    @Input() title: string = '找回密码';

    @ViewChild('windowReference') window: Modal;
    @ViewChild("myValidator") myValidator: SuiValidator;
    rules: ValidatorRule[];

    constructor(private rootElement: ElementRef, private loginService: LoginService) {
        super();
    }

    ngOnInit() {
        this.initValidator();
    }

    /** 打开弹出框 */
    open() {
        this.window.open();
    }

    /** 关闭弹出框 */
    close(arg?: any) {
        this.window.close();
    }

    /** 发送验证码 */
    sendVCode() {
        this.myValidator.pass('.phone-input').subscribe((isPass) => {
            console.debug(this.CLASS_NAME, "sendVCode.......isPass: ", isPass);
            if (isPass) {
                this.loginService.sendVCode(this.forgetPasswordForm.phone).subscribe(response => {
                    if (response.retCode !== 0) {
                        this.countStart = false;
                        return;
                    } else {
                        this.countDown(this.time);
                    }
                });
            }
        });
    }

    /** 提交 */
    confirm() {
        this.myValidator.pass('.phone-input').subscribe((isPass) => {
            console.debug(this.CLASS_NAME, "confirm.......isPass: ", isPass);
            if (isPass) {
                let mobile = this.forgetPasswordForm.phone,
                    vcode = this.forgetPasswordForm.vCode,
                    newPwsd = '0x' + Md5.hashStr(this.forgetPasswordForm.confirmPassword);
                this.loadSpin.isOpen = true;
                this.loginService.resetPwsd(mobile, vcode, newPwsd).subscribe(response => {
                    this.loadSpin.isOpen = false;
                    if (response.retCode !== 0) {
                        this.forgetPasswordForm.errorMessage = response.message || '找回密码失败！';
                        return;
                    } else {
                        this.close();
                    }
                });
            }
        });
    }

    /** 取消 */
    cancel() {
        this.close();
    }

    /** 进行倒计时 */
    private countDown(time: number) {
        this.countStart = true;
        let intervalId = setInterval(() => {
            time--;
            this.vCodeBtnText = `${time}秒后重新获取`;
            if (time == 0) {
                this.countStart = false;
                this.vCodeBtnText = '重新获取';
                clearInterval(intervalId)
            }
        }, 1000)
    }

    /** 校验规则 */
    private initValidator(): void {
        this.rules = [
            {
                input: '.phone-input',
                message: '手机号必填!',
                action: 'keyup, blur',
                rule: 'required'
            },
            {
                input: '.phone-input',
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
                input: '.vCode-input',
                message: '请输入验证码!',
                action: 'keyup, blur',
                rule: 'required'
            },
            {
                input: '.password-input',
                message: '密码必填!',
                action: 'keyup, blur',
                rule: 'required'
            },
            {
                input: '.password-input',
                message: '请输入长度为3-16的密码!',
                action: 'keyup, blur',
                rule: 'length=3,16'
            },
            {
                input: '.confirm-password-input',
                message: '两次输入密码不一致!',
                action: 'keyup, focus',
                rule: (input: any, commit: any): boolean => {
                    if (this.forgetPasswordForm.password === this.forgetPasswordForm.confirmPassword) {
                        return true;
                    }
                    return false;
                }
            }
        ];
    }

}
