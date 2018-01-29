import { RouterModule } from '@angular/router';

import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { IndexRouterModule } from "./index-router.module";

let currentCatalogPath = "../storehouse-manage/" ;
@NgModule({
    declarations: [
        
    ],
    imports: [ 
        CommonModule
        ,RouterModule.forChild([
            { path: "storehouse", loadChildren: currentCatalogPath + "storehouse/index-router.module#IndexRouterModule" },
            { path: "manageShop", loadChildren: currentCatalogPath + "storehouse/manage-shop/manage-shop.module#ManageShopModule" },
            { path: "stockpdyk", loadChildren: currentCatalogPath + "stockpdyk/index-router.module#IndexRouterModule" },
            { path: "purchaseInput", loadChildren: currentCatalogPath + "purchase-input/index-router.module#IndexRouterModule" },
            { path: "transfer", loadChildren: currentCatalogPath + "transfer/index-router.module#IndexRouterModule" },
            { path: "stockList", loadChildren: currentCatalogPath + "stockList/index-router.module#IndexRouterModule" },
            { path: "bookList", loadChildren: currentCatalogPath + "stockList/book-list/book-list.module#BookListModule" },
            { path: "outInput", loadChildren: currentCatalogPath + "out-input/index-router.module#IndexRouterModule" }
        ])
    ],
    exports: [],
    providers: [
    ],

})
export class IndexModule {}  