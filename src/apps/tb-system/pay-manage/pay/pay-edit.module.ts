import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { PayEditComponent } from './pay-edit.component';
import { PayEditService } from './pay-edit.service';
import { CommonEditModule } from '../../../../common/business-groups/common-edit.module';
import { SuiGoodsModule } from '../../../../common/business-components/base/goods/sui-goods.module';
import { SuiSupplierModule } from '../../../../common/business-components/base/supplier/sui-supplier.module';

/*
 * 支付管理编辑模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:17:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-25 14:55:20
 */
@NgModule({
    declarations: [PayEditComponent],
    imports: [
        CommonModule
        , CommonEditModule
        , SuiSupplierModule
        , SuiGoodsModule
        , RouterModule.forChild([
            { path: "", component: PayEditComponent },
        ])
    ],
    exports: [],
    providers: [PayEditService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PayEditModule { }