import { ClientSessionDataService } from './../common/business-components/sui-frameworks/client-session-data.service';
import { SuiRouterService } from './../common/directives/router/sui-router.sevice';
import { SuiRouterModule } from './../common/directives/router/sui-router.module';
import { TopCommon } from '../common/top-common/top-common';
import { CommonServices } from '../common/services/groups/common-services.module';
import { Component, OnInit, OnDestroy,AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './main-entry.component.html',
    styleUrls: ['./main-entry.component.scss']
})
export class MainEntryComponent extends TopCommon  implements OnInit,AfterViewInit, OnDestroy {

    isUserSuiFramework: boolean = true ;
    constructor(
       private suiRouter: SuiRouterService,
       private clientSessionData: ClientSessionDataService
    ) {
        super();
     }

    ngOnInit() {
      let routerUrl: string = this.suiRouter.getUrlBylocation().url ;
      if(!routerUrl || routerUrl.length < 2 || routerUrl=="login") {
          this.isUserSuiFramework = false;
        } else {
            this.clientSessionData.newBrowserTagInitCache();
        }
    }
    ngAfterViewInit() {
    }

    ngOnDestroy() {
    }
}
