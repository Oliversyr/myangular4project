import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
 * 账户列表模块入口路由
 * @Author: gzn 
 * @Date: 2018-01-17
 */
@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "", loadChildren: "./subacct-list.module#SubAcctListModule"},
            {path: "detail", loadChildren: "./subacct-detail/subacct-detail.module#SubAcctDetailModule"}
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}