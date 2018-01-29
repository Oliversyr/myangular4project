import { NgModule, InjectionToken,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
let appName = "financeAssistant";
let root = "../" + appName + "/";
let routers = [
    { path: appName, loadChildren: root + "financial-manage/currentAccount/currentAccount.module#CurrentAccountModule" },
    // { path: appName + "/storehouse", loadChildren: root + "storehouse-manage/storehouse/index-router.module#IndexRouterModule" },
    // { path: appName + "/manageShop", loadChildren: root + "storehouse-manage/storehouse/manageShop/manageShop.module#ManageShopModule" }
];



@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule
        , RouterModule.forChild(routers)
    ],
    exports: [],
    providers: [
    ],

})
export class RootRouterModule {
   
}  