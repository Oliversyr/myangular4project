import { TopCommon } from './../../common/top-common/top-common';
import { Component, OnInit, OnDestroy,AfterViewInit } from '@angular/core';

@Component({
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent extends TopCommon  implements OnInit,AfterViewInit, OnDestroy {

    constructor(
    ) {
        super();
     }

    ngOnInit() {
      
    }
    ngAfterViewInit() {
    }

    ngOnDestroy() {
    }
}
