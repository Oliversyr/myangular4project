import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
 * 配送单模块入口路由
 * @Author: xiahl 
 * @Date: 2017-12-25 14:28:46 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-02 11:02:02
 */
@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "", loadChildren: "./delivery-list.module#DeliveryListModule"},
            {path: "detail", loadChildren: "./delivery-detail.module#DeliveryDetailModule"},
            {path: "edit", loadChildren: "./delivery-edit.module#DeliveryEditModule"},
            {path: "add", loadChildren: "./delivery-edit.module#DeliveryEditModule"},
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}