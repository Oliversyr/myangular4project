import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NO_ERRORS_SCHEMA, ElementRef, OnInit, OnDestroy, Component, ChangeDetectionStrategy, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxCheckBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcheckbox';
/**
 * checkbox
 * 
 */
@Component({
    selector: "sui-checkbox",
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
        ,styles: [`
         
    `]
    ,providers    : [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiCheckBox),
            multi: true
        }
      ]
})
export class SuiCheckBox extends jqxCheckBoxComponent implements  OnInit,  OnDestroy {
      
 
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
        SuiCheckBox
    ],
    declarations: [ 
        jqxCheckBoxComponent,
        SuiCheckBox 
    ]
    ,schemas: [ NO_ERRORS_SCHEMA ]
})
export class SuiCheckBoxModule { }