import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
 * 补货申请模块入口路由
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
            {path: "", loadChildren: "./replenish-list.module#ReplenishListModule"},
            {path: "detail", loadChildren: "./replenish-detail.module#ReplenishDetailModule"},
            {path: "edit", loadChildren: "./replenish-edit.module#ReplenishEditModule"},
            {path: "add", loadChildren: "./replenish-edit.module#ReplenishEditModule"},
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}