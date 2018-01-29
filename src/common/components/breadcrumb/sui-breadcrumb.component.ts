import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector     : 'sui-breadcrumb',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <ng-content></ng-content>`,
  styleUrls    : [
    './style/index.less',
    './style/patch.less'
  ]
})
export class SuiBreadCrumbComponent {
  @Input() nzSeparator = '/';
  @HostBinding('class.ant-breadcrumb') _nzBreadcrumb = true;

  constructor() {
  }

}
