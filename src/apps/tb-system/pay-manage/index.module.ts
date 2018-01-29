import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

let currentCatalogPath = "../pay-manage/";
@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule
        , RouterModule.forChild([
            {
                path: "pay",
                loadChildren: currentCatalogPath + "pay/index-router.module#IndexRouterModule"
            },
        ])
    ],
    exports: [],
    providers: [
    ],

})
export class IndexModule { }  