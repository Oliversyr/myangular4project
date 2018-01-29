import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonListModule } from './../../../../common/business-groups/common-list.module';
import { TransferAddComponent } from './transfer-add.component';
import { TransferService } from './transfer.service';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';

/**
 * 调拨单共享模块
 * @Created by: xiahl 
 * @Created Date: 2017-12-22 17:13:08
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-05 16:46:15
 */
@NgModule({
    declarations: [
        TransferAddComponent
    ],
    imports: [
        CommonListModule,
        SuiOrganModule
    ],
    exports: [
        TransferAddComponent
    ],
    providers: [
        TransferService
    ]
})
export class TransferShareModule { }