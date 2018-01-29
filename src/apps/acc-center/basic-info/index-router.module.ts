import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/*
 * 账户资料列表模块入口路由
 * @Author: gzn 
 * @Date: 2018-01-23
 */
@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "", loadChildren: "./acctinfo-list.module#AcctInfoListModule"},
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}