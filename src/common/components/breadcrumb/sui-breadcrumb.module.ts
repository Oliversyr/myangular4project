import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuiBreadCrumbComponent } from './sui-breadcrumb.component';
import { SuiBreadCrumbItemComponent } from './sui-breadcrumb-item.component';

@NgModule({
  imports     : [ CommonModule ],
  declarations: [ SuiBreadCrumbComponent, SuiBreadCrumbItemComponent ],
  exports     : [ SuiBreadCrumbComponent, SuiBreadCrumbItemComponent ]
})
export class SuiBreadCrumbModule {
}
