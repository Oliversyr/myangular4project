import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { TransferEditComponent } from './transfer-edit.component';
import { TransferEditService } from './transfer-edit.service';
import { CommonEditModule } from '../../../../common/business-groups/common-edit.module';
import { SuiGoodsModule } from '../../../../common/business-components/base/goods/sui-goods.module';
import { SuiSupplierModule } from '../../../../common/business-components/base/supplier/sui-supplier.module';

/*
 * 调拨单编辑模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:17:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-05 17:38:27
 */
@NgModule({
    declarations: [TransferEditComponent],
    imports: [
        CommonModule
        , CommonEditModule
        , SuiSupplierModule
        , SuiGoodsModule
        , RouterModule.forChild([
            { path: "", component: TransferEditComponent },
        ])
    ],
    exports: [],
    providers: [TransferEditService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class TransferEditModule { }