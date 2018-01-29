import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
 * 支付模块入口路由
 * @Author: xiahl 
 * @Date: 2017-12-25 14:28:46 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-26 10:56:34
 */
@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: "", loadChildren: "./pay-list.module#PayListModule" },
        ])

    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule { }