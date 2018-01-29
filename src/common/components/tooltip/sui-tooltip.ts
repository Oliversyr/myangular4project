import { Component, ElementRef, NgModule, NO_ERRORS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxTooltipComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxtooltip';
/**
 * tooltip
 *
 */
@Component({
    selector: 'sui-tooltip',
    template: '<label><ng-content></ng-content></label>'
})
export class SuiTooltip extends jqxTooltipComponent implements OnInit, OnDestroy {
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
        SuiTooltip
    ],
    declarations: [
        jqxTooltipComponent,
        SuiTooltip
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SuiTooltipModule { }
