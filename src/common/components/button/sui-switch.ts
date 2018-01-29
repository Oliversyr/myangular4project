import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NO_ERRORS_SCHEMA, ElementRef, OnInit, OnDestroy, Component, ChangeDetectionStrategy, forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxSwitchButtonComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxswitchbutton';

/**
 * 开关
 * 
 */
@Component({
    selector: "sui-switch",
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
        ,styles: [`
         
    `]
    ,providers    : [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SuiSwitch),
            multi: true
        }
      ]
})
export class SuiSwitch extends jqxSwitchButtonComponent implements  OnInit,  OnDestroy {
      
 
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
        SuiSwitch
    ],
    declarations: [ 
        jqxSwitchButtonComponent,
        SuiSwitch 
    ]
    ,schemas: [ NO_ERRORS_SCHEMA ]
})
export class SuiSwitchModule { }