import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonListModule } from './../../../../common/business-groups/common-list.module';
import { DeliveryAddComponent } from './delivery-add.component';
import { DeliveryService } from './delivery.service';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';

/**
 * 配送单共享模块
 * @Created by: xiahl 
 * @Created Date: 2017-12-22 17:13:08
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-09 15:54:23
 */
@NgModule({
    declarations: [
        DeliveryAddComponent
    ],
    imports: [
        CommonListModule,
        SuiOrganModule
    ],
    exports: [
        DeliveryAddComponent
    ],
    providers: [
        DeliveryService
    ]
})
export class DeliveryShareModule { }