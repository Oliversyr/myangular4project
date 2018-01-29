import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
 * 调拨单模块入口路由
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
            {path: "", loadChildren: "./transfer-list.module#TransferListModule"},
            {path: "detail", loadChildren: "./transfer-detail.module#TransferDetailModule"},
            {path: "edit", loadChildren: "./transfer-edit.module#TransferEditModule"},
            {path: "add", loadChildren: "./transfer-edit.module#TransferEditModule"},
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}