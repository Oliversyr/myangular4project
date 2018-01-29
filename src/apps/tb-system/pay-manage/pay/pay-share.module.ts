import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonListModule } from './../../../../common/business-groups/common-list.module';
import { PayAddComponent } from './pay-add.component';
import { PayService } from './pay.service';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';

/**
 * 支付共享模块
 * @Created by: xiahl 
 * @Created Date: 2017-12-22 17:13:08
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-26 11:29:13
 */
@NgModule({
    declarations: [
        PayAddComponent
    ],
    imports: [
        CommonListModule,
        SuiOrganModule
    ],
    exports: [
        PayAddComponent
    ],
    providers: [
        PayService
    ]
})
export class PayShareModule { }