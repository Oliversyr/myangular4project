import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/**
 * 库存盘点列表-编辑-详情界面路由
 */


@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '',     loadChildren: './stockpdyk-list.module#StockPdykListModule' },
            {path: 'detail',   loadChildren: './stockpdyk-detail.module#StockPdykDetailModule' },
            {path: 'edit',     loadChildren: './stockpdyk-edit.module#StockPdykEditModule' }
        ])
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}
