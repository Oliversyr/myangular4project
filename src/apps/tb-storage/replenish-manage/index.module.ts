import { RouterModule } from '@angular/router';

import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { IndexRouterModule } from "./index-router.module";

let currentCatalogPath = "../replenish-manage/" ;
@NgModule({
    declarations: [
        
    ],
    imports: [ 
        CommonModule
        ,RouterModule.forChild([
            { path: "replenish", loadChildren: currentCatalogPath + "replenish/index-router.module#IndexRouterModule" },
            { path: "replenish-handle", loadChildren: currentCatalogPath + "replenish-handle/index-router.module#IndexRouterModule" },
            { path: "delivery", loadChildren: currentCatalogPath + "delivery/index-router.module#IndexRouterModule" },
            { path: "pick", loadChildren: currentCatalogPath + "pick/index-router.module#IndexRouterModule" },
            { path: "split", loadChildren: currentCatalogPath + "pick/split/split-list.module#SplitListModule" },
        ])
    ],
    exports: [],
    providers: [
    ],

})
export class IndexModule {}  