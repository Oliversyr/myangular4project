import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiGoodsComponent} from './sui-goods.component';

import { SuiAutoCompleteModule } from '../../../components/auto-complete/sui-auto-complete.module';
import { SuiGoodsService } from './sui-goods.service';
import { ModalModule } from '../../../components/modal/modal.module';
import { GridModule } from '../../../components/grid/grid.module';


@NgModule({
  declarations: [ SuiGoodsComponent ],
  exports     : [ SuiGoodsComponent ],
  imports     : [ CommonModule, FormsModule, SuiAutoCompleteModule, ModalModule, GridModule ],
  providers: [ SuiGoodsService ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})

export class SuiGoodsModule {

}
