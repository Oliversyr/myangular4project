import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiCustomerComponent} from './sui-customer.component';

import { SuiAutoCompleteModule } from '../../../components/auto-complete/sui-auto-complete.module';
import { SuiCustomerService } from './sui-customer.service';
import { ModalModule } from '../../../components/modal/modal.module';
import { GridModule } from '../../../components/grid/grid.module';


@NgModule({
  declarations: [ SuiCustomerComponent ],
  exports     : [ SuiCustomerComponent ],
  imports     : [ CommonModule, FormsModule, SuiAutoCompleteModule, ModalModule, GridModule ],
  providers: [ SuiCustomerService ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})

export class SuiCustomerModule {

}
