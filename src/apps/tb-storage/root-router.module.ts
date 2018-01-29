import { EmptyComponent } from './../../main-entry/empty/empty.component';
import { NgModule, InjectionToken,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
let appName = "tb-storage";
let root = "../" + appName + "/";
let routers = [
    {path: appName , component: EmptyComponent},
    {path: appName + "/storehouse-manage", loadChildren: root+"storehouse-manage/index.module#IndexModule"},
    {path: appName + "/replenish-manage", loadChildren: root+"replenish-manage/index.module#IndexModule"}
    /**  以下引入了二级,三级目录的路由,都是错误的行为
    { path: appName + "/storehouse-manage/storehouse", loadChildren: root + "storehouse-manage/storehouse/index-router.module#IndexRouterModule" },
    { path: appName + "/replenish-manage/delivery", loadChildren: root + "replenish-manage/delivery/index-router.module#IndexRouterModule" }
    */
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