import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

let currentCatalogPath = "../account-manage/" ;
@NgModule({
    declarations: [
        
    ],
    imports: [ 
        CommonModule
        ,RouterModule.forChild([
            { path: "subacctlist", loadChildren: currentCatalogPath + "subacctlist/index-router.module#IndexRouterModule" }
        ])
    ],
    exports: [],
    providers: [
    ],

})
export class IndexModule {}  