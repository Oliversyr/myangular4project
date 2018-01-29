import { NgModule } from '@angular/core';
import { SuiTagComponent } from './sui-tag.component';
import { SuiCheckableTagComponent } from './sui-checkable-tag.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports     : [ CommonModule, FormsModule ],
  declarations: [
    SuiTagComponent, SuiCheckableTagComponent
  ],
  exports     : [
    SuiTagComponent, SuiCheckableTagComponent
  ]
})

export class SuiTagModule {
}
