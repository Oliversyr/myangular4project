import { SuiValidatorModule } from './../validator/sui-validator';
import { NgModule } from '@angular/core';
import { SuiInputModule } from './../input/sui-input';
import { SuiDateModule } from './../input/sui-date';



@NgModule({
    imports: [ 
        SuiValidatorModule
    ],
    exports: [ 
        SuiValidatorModule
     ],
    declarations: [ 
         
     ]
    //  ,schemas: [ NO_ERRORS_SCHEMA ]
})
export class SuiFormsModule { }