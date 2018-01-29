import { ErrorComponent } from './error/error.component';
import { EmptyComponent } from './empty/empty.component';
import { ResponseContentType } from '@angular/http';
import { SUI_HTTP_CONFIG, SuiHttpConfig } from './../common/services/https/sui-http-config';
import { SuiSpinModule } from './../common/components/spin/sui-spin.module';
import { SuiFrameworkModule } from './../common/business-components/sui-frameworks/sui-framework/sui-framework.module';
import { SuiReuseStrategy } from './sui-reuse-strategy';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { BootstrapCommonModule } from './bootstrap-common.module';

import { NgModule, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MainEntryComponent } from './main-entry.component';
import { AppsEntryRouterModule } from './apps-entry-router.module';
import { CommonServicesModule } from "../common/services/groups/common-services.module";
import { SuiRouterModule } from '../common/directives/router/sui-router.module';
import { SuiHttpModule } from '../common/services/https/sui-http.module';
import { GlobalService } from '../common/global/global.service';
import { ClientSessionDataService } from '../common/business-components/sui-frameworks/client-session-data.service';

@NgModule({
    declarations: [
        MainEntryComponent,
        EmptyComponent,
        ErrorComponent

    ],
    imports: [
        BrowserModule
        ,RouterModule
        , BrowserAnimationsModule
        , BootstrapCommonModule
        , SuiRouterModule
        , SuiFrameworkModule
        , AppsEntryRouterModule
        , CommonServicesModule
        , SuiSpinModule
        // ,SuiHttpModule.forRoot()

    ],
    exports: [],
    providers: [
        GlobalService,
        ClientSessionDataService,
        { provide: RouteReuseStrategy, useClass: SuiReuseStrategy },
        { provide: SUI_HTTP_CONFIG, useValue: { businessHeaders: { "content-type": "application/json" } }}
    ],
    bootstrap: [MainEntryComponent]

})
export class MainEntryModule {
    constructor(
        @Inject(RouteReuseStrategy) routeReuseStrategy: SuiReuseStrategy,
        globalService: GlobalService
    ) {
        routeReuseStrategy.globalService = globalService;
    }
}

