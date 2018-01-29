import { RouterModule } from '@angular/router';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

let currentCatalogPath = "../basic-info/" ;
@NgModule({
    declarations: [
        
    ],
    imports: [ 
        CommonModule
        ,RouterModule.forChild([
            { path: "accountinfo", loadChildren: currentCatalogPath + "index-router.module#IndexRouterModule" }
        ])
    ],
    exports: [],
    providers: [
    ],

})
export class IndexModule {}  