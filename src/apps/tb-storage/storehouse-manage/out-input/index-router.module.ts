import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
    ],
    imports: [ 
        CommonModule, 
        RouterModule.forChild([
            {path: "", loadChildren: "./outInput-list.module#OutInputModule"},
            {path: "edit", loadChildren: "./outInput-edit/outInput-edit.module#OutInputEditModule"},
            {path: "add", loadChildren: "./outInput-edit/outInput-edit.module#OutInputEditModule"},
            {path: "detail", loadChildren: "./outInput-detail/outInput-detail.module#OutInputDetailModule"},
        ])
        
    ],
    exports: [],
    providers: [
    ]

})
export class IndexRouterModule {}