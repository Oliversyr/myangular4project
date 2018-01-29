import { EnterpriseInfo } from './../../../global/sui-local-config';
import { GlobalService } from './../../../global/global.service';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { TopCommon } from './../../../../common/top-common/top-common';
import { LoginService } from './../../../../apps/login/login.service';
import { Menu } from './../../../../common/components/tab-menu/menu';
import { ClientSessionDataService } from '../client-session-data.service';
import { ModalService } from '../../../components/modal/modal.service';
import { Application } from './application';

@Component({
    selector: 'sui-framework-header',
    templateUrl: './sui-framework-header.html',
    styleUrls: ['./sui-framework-header.scss']
})
export class SuiFrameworkHeaderComponent extends TopCommon implements OnInit {

    /** 企业信息 */
    enterpriseInfo: EnterpriseInfo;

    /** 应用列表信息 */
    @Input() appsList: Array<any> = [];

    /** 用户信息 */
    userInfo: any = {};

    /** 更多显示 */
    moreShow: boolean = false;

    constructor(
        private loginService: LoginService
        , private globalService: GlobalService
        , private clientSessionDataService: ClientSessionDataService
        , private modalService: ModalService) {
        super();
    }

    ngOnInit() {
        this.userInfo = this.clientSessionDataService.getUserInfo();
        this.enterpriseInfo = this.globalService.getSuiLocalConfig().ENTERPRISE_INFO;
    }

    goToApp(app: Application, event) {
        event.stopPropagation();
        event.preventDefault();
        if(app.target == "_blank") {
            window.open(app.appurl);
        } else {
            window.location.href=app.appurl;
            window.location.reload();
        }
    }

    /** 系统退出 */
    logOut() {
        let message = '您确定退出？',
            title = '退出提示',
            msgType = 'info';
        this.modalService.modalConfirm(message, title, msgType).subscribe((retCode: string): void => {
            console.debug(">>>>>the modal confirm call back function.retCode", retCode);
            if(retCode === 'OK'){
                this.loginService.fedLogOut().subscribe((res) => {
                    if (res === 'SUCCESS') {
                        this.globalService.goToLoginPage();
                    }
                })
            }
        });        
    }
} 