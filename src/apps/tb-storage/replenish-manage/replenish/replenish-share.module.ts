import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonListModule } from './../../../../common/business-groups/common-list.module';
import { ReplenishService } from './replenish.service';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';
import { ReplenishAddComponent } from './replenish-add.component';

/**
 * 补货申请共享模块
 * @Created by: xiahl 
 * @Created Date: 2017-12-22 17:13:08
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-08 17:59:48
 */
@NgModule({
    declarations: [
        ReplenishAddComponent
    ],
    imports: [
        CommonListModule,
        SuiOrganModule
    ],
    exports: [
        ReplenishAddComponent
    ],
    providers: [
        ReplenishService
    ]
})
export class ReplenishShareModule { }