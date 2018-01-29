import { SuiLocalConfig, ConsoleLogLevel } from './sui-local-config';
import { KeyboardService } from './../directives/keyboard/keyboard.service';
import { ModalService } from './../components/modal/modal.service';
import { ClientSessionDataService } from './../business-components/sui-frameworks/client-session-data.service';
import { TabManager } from './../components/tab-menu/tab-manager';
import { Injectable } from '@angular/core';
import { ResponseRetCode } from '../services/https/sui-http-entity';

declare var SUI_LOCAL_CONFIG: SuiLocalConfig;
/**
 * @author liurong
 * @date 2017-11-03
 * @notes 全局服务类,应用启动立即加载,系统任何地方都可以使用到[]
 * 包含: 
 */
@Injectable()
export class GlobalService {
    tabManager: TabManager;
    clientSessionData: ClientSessionDataService;
    modalService: ModalService;
    keyboardService: KeyboardService;
    private localConfig: SuiLocalConfig;


    constructor(

    ) {
        this.localConfig = Object.assign({}, SUI_LOCAL_CONFIG);
        this.initLogLevel();
    }

    /**
     * 获取本地配置文件信息
     * z-config/sui-local-config.js配置信息
     * 
     * @returns {SuiLocalConfig} 
     * @memberof GlobalService
     */
    getSuiLocalConfig(): SuiLocalConfig {
        return this.localConfig;
    }

    /**
     * 在指定元素定位焦点
     * 1. element 默认document
     * @param {HTMLElement=document}element 
     */
    focusInElement(element?: HTMLElement) {
        element = element || document as any;
        let defaultFocusEL: HTMLElement = element.querySelector("[defaultFocus]") as HTMLElement;
        defaultFocusEL = defaultFocusEL ? defaultFocusEL : document.querySelector("[tabindex]") as HTMLElement;
        if (this.keyboardService) {
            this.keyboardService.fucos(defaultFocusEL);
        } else {
            defaultFocusEL.focus();
        }
    }

    /**
     * 焦点定位到当前页面
     */
    focusInCurrentPage(): void {
        if (this.tabManager) {
            this.tabManager.focusCurrentTabPage();
        } else {
            this.focusInElement(null);
        }
    }

    /**
     * 检查登录(是否登录超时)
     * true - 已登录
     * false - 未定论
     * @param rep 
     */
    checkLogin(rep?: any): boolean {
        //登录超时
        //开发模式不弹出提示框
        if (this.localConfig.ENV_MODE != "dev" && rep && rep.retCode === ResponseRetCode.LOGIN_TIMEOUT) {
            //链接超时
            this.afterLoginOutPrompt();
            this.clientSessionData.clearLoginInfo();
            return false;
        }
        if (!this.clientSessionData) {
            console.error("clientSessionData undefined ,can't check Login state");
            return false;
        }
        if (this.clientSessionData.checkLogin()) {
            return true;
        }
        this.afterLoginOutPrompt();
        return false;
    }

    /**
     * 登录已退出前提示;
     * 超时之类
     */
    afterLoginOutPrompt() {
        try {
            let message: string = "您当前的会话已超时，请重新登录";
            if (this.modalService) {
                this.modalService.modalAlert("您当前的会话已超时，请重新登录").subscribe(() => {
                    this.goToLoginPage();
                });
            } else {
                alert(message);
                this.goToLoginPage();
            }
        } catch (e) {
            console.error("login timeout", e.stack);
            this.goToLoginPage();
        }

    }

    goToLoginPage() {
        window.location.href = "#/login";
        window.location.reload();
    }

    private initLogLevel() {
        let levelName: string = this.localConfig.CONSOLE_LOG_LEVEL;
        let levelValue: ConsoleLogLevel = ConsoleLogLevel[levelName] || ConsoleLogLevel.DEBUG;
        if (levelValue > ConsoleLogLevel.DEBUG) {
            console.debug = function () { };
            console.dir = function () { };
        }

        if (levelValue > ConsoleLogLevel.LOG) {
            console.log = function () { };
        }

        if (levelValue > ConsoleLogLevel.INFO) {
            console.info = function () { };
        }

        if (levelValue > ConsoleLogLevel.WARN) {
            console.warn = function () { };
        }

        if (levelValue > ConsoleLogLevel.ERROR) {
            console.error = function () { };
        }
    }


}