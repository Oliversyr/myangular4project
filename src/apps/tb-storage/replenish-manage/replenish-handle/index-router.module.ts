import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
 * 补货申请处理模块入口路由
 * @Author: xiahl 
 * @Date: 2017-12-25 14:28:46 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-09 09:59:14
 */
@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "", loadChildren: "./replenish-handle-list.module#ReplenishHandleListModule"},
        ])
        
    ],
    exports: [],
    providers: []

})
export class IndexRouterModule {}