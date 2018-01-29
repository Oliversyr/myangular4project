import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "", loadChildren: "./purchase-input-list.module#PurchaseInputListModule"},
            {path: "detail", loadChildren: "./purchase-input-detail.module#PurchaseInputDetailModule"},
            {path: "edit", loadChildren: "./purchase-input-edit.module#PurchaseInputEditModule"},
            {path: "add", loadChildren: "./purchase-input-edit.module#PurchaseInputEditModule"},
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}