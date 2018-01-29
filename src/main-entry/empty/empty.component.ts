import { TopCommon } from './../../common/top-common/top-common';
import { Component, OnInit, OnDestroy,AfterViewInit } from '@angular/core';

@Component({
    templateUrl: './empty.component.html',
    styleUrls: ['./empty.component.scss']
})
export class EmptyComponent extends TopCommon  implements OnInit,AfterViewInit, OnDestroy {

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
