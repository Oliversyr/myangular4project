import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { PurchaseInputEditComponent } from './purchase-input-edit.component';
import { PurchaseInputEditService } from './purchase-input-edit.service';
import { CommonEditModule } from '../../../../common/business-groups/common-edit.module';
import { SuiGoodsModule } from '../../../../common/business-components/base/goods/sui-goods.module';
import { SuiSupplierModule } from '../../../../common/business-components/base/supplier/sui-supplier.module';

/*
 * 采购入库编辑模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:17:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-05 10:14:43
 */
@NgModule({
    declarations: [PurchaseInputEditComponent],
    imports: [
        CommonModule
        , CommonEditModule
        , SuiSupplierModule
        , SuiGoodsModule
        , RouterModule.forChild([
            { path: "", component: PurchaseInputEditComponent },
        ])
    ],
    exports: [],
    providers: [PurchaseInputEditService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PurchaseInputEditModule { }