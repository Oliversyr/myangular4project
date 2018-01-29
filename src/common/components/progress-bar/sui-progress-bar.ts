import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, ElementRef, OnInit, OnDestroy, Component, ChangeDetectionStrategy, forwardRef, ViewChild, NgModule, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxProgressBarComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxprogressbar';

/**
 * progress bar
 * 
 */

// const noop = () => { };
// declare let JQXLite: any;
@Component({
    selector: "sui-progress-bar",
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiProgressBar),
            multi: true
        }
      ]
})
export class SuiProgressBar extends jqxProgressBarComponent implements  OnInit, OnDestroy {

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
        CommonModule, FormsModule
    ],
    exports: [ 
        SuiProgressBar
    ],
    declarations: [ 
        jqxProgressBarComponent,
        SuiProgressBar 
    ]
    ,schemas: [ NO_ERRORS_SCHEMA ]
})
export class SuiProgressBarModule { }