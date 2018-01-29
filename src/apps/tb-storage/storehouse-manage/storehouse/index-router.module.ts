import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "", loadChildren: "./storehouse-list.module#StorehouseModule"},
            // {path: "manageShop", loadChildren: "./manage-shop/manage-shop.module#ManageShopModule"},
            {path: "edit", loadChildren: "./storehouse-edit/storehouse-edit.module#StorehouseEditModule"},
            {path: "add", loadChildren: "./storehouse-edit/storehouse-edit.module#StorehouseEditModule"},
            {path: "detail", loadChildren: "./storehouse-detail/storehouse-detail.module#StorehouseDetailModule"},
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}