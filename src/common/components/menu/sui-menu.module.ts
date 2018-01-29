// import { NzButtonModule } from 'ng-zorro-antd';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { NzButtonModule } from '../button/sui-button.module';
import { SuiMenuComponent } from '../menu/sui-menu.component';
import { SuiMenuItemComponent } from '../menu/sui-menu-item.component';
import { SuiMenuDividerComponent } from '../menu/sui-menu-divider.component';
import { SuiSubMenuComponent } from '../menu/sui-submenu.component';
import { SuiMenuGroupComponent } from '../menu/sui-menu-group.component';

@NgModule({
  imports     : [ CommonModule, FormsModule
    // ,NzButtonModule
    // ,NgZorroAntdModule
  ],
  declarations: [ SuiMenuComponent, SuiMenuItemComponent, SuiSubMenuComponent, SuiMenuDividerComponent, SuiMenuGroupComponent ],
  exports     : [ SuiMenuComponent, SuiMenuItemComponent, SuiSubMenuComponent, SuiMenuDividerComponent, SuiMenuGroupComponent ]
})
export class SuiMenuModule {
}
