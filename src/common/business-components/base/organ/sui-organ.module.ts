import { FormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiOrganComponent} from './sui-organ.component';
import { StopPropagationDirective } from '../../../directives/stop-propagation.directive';
import { CommonListModule } from './../../../../common/business-groups/common-list.module';

import { SuiAutoCompleteModule } from '../../../components/auto-complete/sui-auto-complete.module';
import { SuiOrganService } from './sui-organ.service';
import { ModalModule } from '../../../components/modal/modal.module';
import { GridModule } from '../../../components/grid/grid.module';


@NgModule({
  declarations: [ SuiOrganComponent ],
  exports     : [ SuiOrganComponent ],
  imports     : [ CommonModule, FormsModule, SuiAutoCompleteModule, ModalModule, CommonListModule ],
  providers: [ SuiOrganService ],
  schemas:      [ NO_ERRORS_SCHEMA ]
})

export class SuiOrganModule {

}
