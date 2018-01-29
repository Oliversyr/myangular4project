import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiTabsModule } from '../../../components/tabs/sui-tabs.module';
import { SuiResponsiveModule } from '../../../components/responsive/sui-responsive.module';
import { SuiAreaComponent} from './sui-area.component';


@NgModule({
  declarations: [ SuiAreaComponent ],
  exports     : [ SuiAreaComponent ],
  imports     : [ CommonModule, FormsModule, SuiTabsModule, SuiResponsiveModule ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})

export class SuiAreaModule {
}