import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiAccCustomerComponent} from './sui-acc-customer.component';

import { SuiAutoCompleteModule } from '../../../components/auto-complete/sui-auto-complete.module';
import { SuiAccCustomerService } from './sui-acc-customer.service';
import { ModalModule } from '../../../components/modal/modal.module';
import { GridModule } from '../../../components/grid/grid.module';


@NgModule({
  declarations: [ SuiAccCustomerComponent ],
  exports     : [ SuiAccCustomerComponent ],
  imports     : [ CommonModule, FormsModule, SuiAutoCompleteModule, ModalModule, GridModule ],
  providers: [ SuiAccCustomerService ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})

export class SuiAccCustomerModule {

}
