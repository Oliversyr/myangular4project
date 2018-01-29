import { Component, Input, OnInit } from '@angular/core';
import { TopCommon } from './../../common/top-common/top-common';
import { LoginService } from './login.service';

@Component({
    selector: 'login-body',
    templateUrl: './login-body.html',
    styleUrls: ['./login.scss', './login-body.scss']
})
export class LoginBodyComponent extends TopCommon implements OnInit {

    enterpriseInfo: any = {}

    constructor(private loginService: LoginService) {
        super();
    }

    ngOnInit() {
        this.enterpriseInfo = this.loginService.enterpriseInfo;      
    }
}
