import { Component, ElementRef, NgModule, NO_ERRORS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxTreeComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtree';
/**
 * tree
 *
 */
@Component({
    selector: 'sui-tree',
    template: '<div><ng-content></ng-content></div>'
})
export class SuiTree extends jqxTreeComponent implements OnInit, OnDestroy {
    constructor(
        containerElement: ElementRef
    ) {
        super(containerElement);
    }

    ngOnDestroy() {
    }
}


@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        SuiTree
    ],
    declarations: [
        jqxTreeComponent,
        SuiTree
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SuiTreeModule { }
