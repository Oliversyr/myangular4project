import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { PurchaseInputListComponent } from './purchase-input-list.component';
import { PurchaseInputService } from './purchase-input.service';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';
import { SuiGoodsModule } from './../../../../common/business-components/base/goods/sui-goods.module';
import { PrintModule } from '../../../../common/components/print/print';
import { SuiExportModule } from '../../../../common/components/export/sui-export';
import { PurchaseInputListService } from './purchase-input-list.service';
import { PurchaseInputAddComponent } from './purchase-input-add.component';
import { PurchaseInputCheckComponent } from './purchase-input-check.component';
import { PurchaseInputShareModule } from './purchase-input-share.module';

/**
 * 采购入库列表模块
 * @Created by: xiahl 
 * @Created Date: 2017-12-22 17:13:08
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-05 10:05:35
 */
@NgModule({
    declarations: [
        PurchaseInputListComponent
    ],
    imports: [
        CommonModule
        , CommonListModule
        , SuiOrganModule
        , SuiGoodsModule
        , PurchaseInputShareModule
        , RouterModule.forChild([
            { path: "", component: PurchaseInputListComponent },
        ])
    ],
    exports: [

    ],
    providers: [
        PurchaseInputListService
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PurchaseInputListModule { }