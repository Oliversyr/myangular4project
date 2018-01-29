import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiSupplierComponent} from './sui-supplier.component';

import { SuiAutoCompleteModule } from '../../../components/auto-complete/sui-auto-complete.module';
import { SuiSupplierService } from './sui-supplier.service';
import { ModalModule } from '../../../components/modal/modal.module';
import { GridModule } from '../../../components/grid/grid.module';


@NgModule({
  declarations: [ SuiSupplierComponent ],
  exports     : [ SuiSupplierComponent ],
  imports     : [ CommonModule, FormsModule, SuiAutoCompleteModule, ModalModule, GridModule ],
  providers: [ SuiSupplierService ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})

export class SuiSupplierModule {

}
