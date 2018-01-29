import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonListModule } from './../../../../common/business-groups/common-list.module';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';
import { SuiSupplierModule } from '../../../../common/business-components/base/supplier/sui-supplier.module';
import { PurchaseInputCheckComponent } from './purchase-input-check.component';
import { PurchaseInputAddComponent } from './purchase-input-add.component';
import { PurchaseInputService } from './purchase-input.service';

/**
 * 采购入库共享模块
 * @Created by: xiahl 
 * @Created Date: 2017-12-22 17:13:08
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-04 19:47:41
 */
@NgModule({
    declarations: [
        PurchaseInputAddComponent
        , PurchaseInputCheckComponent
    ],
    imports: [
        CommonListModule
        , SuiOrganModule
        , SuiSupplierModule
    ],
    exports: [
        PurchaseInputAddComponent
        , PurchaseInputCheckComponent
    ],
    providers: [
        PurchaseInputService
    ]
})
export class PurchaseInputShareModule { }