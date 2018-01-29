import { NgModule, InjectionToken, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyComponent } from './../../main-entry/empty/empty.component';

import { RouterModule } from '@angular/router';
let appName = "acc-center";
let root = "../" + appName + "/";
let routers = [
    { path: appName, component: EmptyComponent },
    { path: appName + "/acctmgr", loadChildren: root + "account-manage/index.module#IndexModule" },
    { path: appName + '/bushandle', loadChildren: root + 'business-handle/index.module#IndexModule' },

    {path: appName + "/basicdata", loadChildren: root+"basic-info/index.module#IndexModule"},
];

@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routers)
    ],
    exports: [],
    providers: [
    ],

})
export class RootRouterModule {

}