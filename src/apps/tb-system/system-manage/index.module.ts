import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

let currentCatalogPath = "../system-manage/";
@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule
        , RouterModule.forChild([
            {
                path: "role",
                // loadChildren: currentCatalogPath + "monitor/index-router.module#IndexRouterModule"
                loadChildren: currentCatalogPath + "role/role.module#RoleModule"
            },
        ])
    ],
    exports: [],
    providers: [
    ],

})
export class IndexModule { }  