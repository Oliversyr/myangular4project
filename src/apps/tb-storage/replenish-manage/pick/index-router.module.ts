import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "", loadChildren: "./pick-list.module#PickListModule"},
            {path: "edit", loadChildren: "./pick-edit/pick-edit.module#PickEditModule"},
            {path: "add", loadChildren: "./pick-edit/pick-edit.module#PickEditModule"},
            {path: "detail", loadChildren: "./pick-detail/pick-detail.module#PickDetailModule"},
        ])
        
    ],
    providers: [
    ]

})
export class IndexRouterModule {}