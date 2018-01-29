import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "", loadChildren: "./stockList-list.module#StockListModule"},
            {path: "bookList", loadChildren: "./book-list/book-list.module#BookListModule"},
            // {path: "edit", loadChildren: "./stockList-edit/stockList-edit.module#StockListEditModule"},
            // {path: "add", loadChildren: "./stockList-edit/stockList-edit.module#StockListEditModule"},
            // {path: "detail", loadChildren: "./stockList-detail/stockList-detail.module#StockListDetailModule"},
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}