import { Component, Input, OnInit } from '@angular/core';
import { TopCommon } from './../../common/top-common/top-common';
import { LoginService } from './login.service';

@Component({
    selector: 'login-header',
    templateUrl: './login-header.html',
    styleUrls: ['./login.scss']
})
export class LoginHeaderComponent extends TopCommon implements OnInit {

    enterpriseInfo: any = {}

    constructor(private loginService: LoginService) {
        super();       
    }

    ngOnInit() {
        this.enterpriseInfo = this.loginService.enterpriseInfo;       
    }
}
