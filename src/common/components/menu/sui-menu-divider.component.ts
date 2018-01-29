import { Component, HostBinding } from '@angular/core';

@Component({
  selector     : '[sui-menu-divider]',
  template     : `
    <ng-content></ng-content>`,
})

export class SuiMenuDividerComponent {
  @HostBinding('class.ant-dropdown-menu-item-divider') _nzDropdownMenuItemDivider = true;
}
