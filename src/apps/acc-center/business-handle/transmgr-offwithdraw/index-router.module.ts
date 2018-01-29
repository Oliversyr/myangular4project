import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
 * 线下提现模块入口路由
 * @Author: lizw
 * @Date: 2018-01-24
 */
@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', loadChildren: './offwithdraw-list.module#OffwithdrawListModule' },
            // {path: "detail", loadChildren: "./subacct-detail/subacct-detail.module#SubAcctDetailModule"}
        ])

    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule { }