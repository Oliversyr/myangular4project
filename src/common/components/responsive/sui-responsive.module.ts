import { NgModule } from '@angular/core';
import { SuiRowComponent } from './sui-row.component';
import { SuiColDirective } from './sui-col.directive';
import { SuiColComponent } from './sui-col.component';
import { CommonModule } from '@angular/common';

/**
 * 响应式布局
 */
@NgModule({
  declarations: [ SuiRowComponent, SuiColDirective, SuiColComponent ],
  exports     : [ SuiRowComponent, SuiColDirective, SuiColComponent ],
  imports     : [ CommonModule ]
})

export class SuiResponsiveModule {
}
