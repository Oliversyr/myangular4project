import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiComboBoxModule } from '../../../components/input/sui-combobox';
import { SuiCellModule } from './../../../components/input/cell';
import { SuiUserComponent} from './sui-user.component';


@NgModule({
  declarations: [ SuiUserComponent ],
  exports     : [ SuiUserComponent ],
  imports     : [ CommonModule, FormsModule, SuiComboBoxModule, SuiCellModule ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})

export class SuiUserModule {
}
