import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
@Description: 线下充值模块入口路由
 * @Author: cheng
 * @Date: 2018-01-29 17:54:23
* @Last Modified by:   cheng
* @Last Modified time: 2018-01-29 17:54:23
 */
@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', loadChildren: './recharge-list.module#RechargeListModule' }
        ])

    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule { }
