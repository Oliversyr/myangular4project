import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiComboBoxModule } from '../../../components/input/sui-combobox';
import { SuiBrandComponent} from './sui-brand.component';


@NgModule({
  declarations: [ SuiBrandComponent ],
  exports     : [ SuiBrandComponent ],
  imports     : [ CommonModule, FormsModule, SuiComboBoxModule ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})

export class SuiBrandModule {
}
