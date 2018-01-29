import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { TopCommon } from './../../common/top-common/top-common';

@Component({
    selector: 'login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent extends TopCommon implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {
        
    }
}
