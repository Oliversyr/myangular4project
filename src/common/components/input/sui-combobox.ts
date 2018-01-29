import { Component, ChangeDetectionStrategy, forwardRef, OnInit, OnDestroy, ElementRef, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { jqxComboBoxComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxcombobox';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

 
/**
 * 组合下拉框
 * 
 */
@Component({
    selector: "sui-combobox",
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
    ,styles: [`
    `]
    ,providers    : [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiComboBox),
            multi: true
        }
      ]
})
export class SuiComboBox extends jqxComboBoxComponent implements  OnInit,  OnDestroy {
      
    
    constructor(
        containerElement: ElementRef
    ) { 
        super(containerElement);
        //默认500
        this.attrPopupZIndex = 500;
        this.attrAnimationType = "none";
     }

  
    ngOnDestroy() {

    }

}


@NgModule({
    imports: [ 
        CommonModule
    ],
    exports: [ 
        SuiComboBox
    ],
    declarations: [ 
        SuiComboBox,
        jqxComboBoxComponent

    ]
    ,schemas: [ NO_ERRORS_SCHEMA ]
})
export class SuiComboBoxModule { }