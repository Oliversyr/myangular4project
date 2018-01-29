import { NgModule, InjectionToken, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyComponent } from './../../main-entry/empty/empty.component';

import { RouterModule } from '@angular/router';
let appName = "tb-system";
let root = "../" + appName + "/";
let routers = [

    { path: appName, component: EmptyComponent },
    { path: appName + "/system-manage", loadChildren: root + "system-manage/index.module#IndexModule" },
    { path: appName + "/pay-manage", loadChildren: root + "pay-manage/index.module#IndexModule" },
    { path: appName + "/monitor-manage", loadChildren: root + "monitor-manage/index.module#IndexModule" },

];



@NgModule({
    declarations: [

    ],
    imports: [
        // CommonModule
        // , 
        RouterModule.forChild(routers)
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ],

})
export class RootRouterModule {

}  