import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiTreeModule } from '../../../components/tree/sui-tree';
import { SuiCategoryComponent} from './sui-category.component';


@NgModule({
  declarations: [ SuiCategoryComponent ],
  exports     : [ SuiCategoryComponent ],
  imports     : [ CommonModule, FormsModule, SuiTreeModule ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})

export class SuiCategoryModule {
}
