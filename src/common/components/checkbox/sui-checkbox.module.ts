import { NgModule } from '@angular/core';
import { SuiCheckboxComponent } from './sui-checkbox.component';
import { SuiCheckboxGroupComponent } from './sui-checkbox-group.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports     : [ CommonModule, FormsModule ],
  declarations: [
    SuiCheckboxComponent,
    SuiCheckboxGroupComponent
  ],
  exports     : [
    SuiCheckboxComponent,
    SuiCheckboxGroupComponent
  ]
})

export class SuiCheckboxModule {
}
