import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const currentCatalogPath = '../business-handle/';
@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule
        , RouterModule.forChild([
            { path: 'withdraw', loadChildren: currentCatalogPath + 'transmgr-offwithdraw/index-router.module#IndexRouterModule' },
            { path: 'recharge', loadChildren: currentCatalogPath + 'recharge/index-router.module#IndexRouterModule' },

        ])
    ],
    exports: [],
    providers: [
    ],

})
export class IndexModule { }