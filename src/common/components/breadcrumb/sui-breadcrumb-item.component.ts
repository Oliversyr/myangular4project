import {
  Component,
} from '@angular/core';
import { SuiBreadCrumbComponent } from './sui-breadcrumb.component';

@Component({
  selector: 'sui-breadcrumb-item',
  template: `
    <span class="ant-breadcrumb-link">
      <ng-content></ng-content>
    </span>
    <span class="ant-breadcrumb-separator">{{suiBreadCrumbComponent?.nzSeparator}}</span>`
})
export class SuiBreadCrumbItemComponent {
  constructor(
    public suiBreadCrumbComponent: SuiBreadCrumbComponent
  ) {
  }

}
