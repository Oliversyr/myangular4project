import { SuiSpinService } from './sui-spin.service';
import { SuiSuiDirective } from './sui-spin.directive';
import { NgModule } from '@angular/core';
import { SuiSpinComponent } from './sui-spin.component';
import { CommonModule } from '@angular/common';

@NgModule({
  exports     : [ 
    SuiSpinComponent 
    ,SuiSuiDirective
  ],
  declarations: [ 
    SuiSpinComponent 
    ,SuiSuiDirective
  ],
  imports     : [ 
    CommonModule 
  ]
  ,providers: [
    SuiSpinService
  ]
})

export class SuiSpinModule {
}
