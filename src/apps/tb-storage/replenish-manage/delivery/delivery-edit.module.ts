import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { DeliveryEditComponent } from './delivery-edit.component';
import { DeliveryEditService } from './delivery-edit.service';
import { CommonEditModule } from '../../../../common/business-groups/common-edit.module';
import { SuiGoodsModule } from '../../../../common/business-components/base/goods/sui-goods.module';
import { SuiSupplierModule } from '../../../../common/business-components/base/supplier/sui-supplier.module';

/*
 * 配送单编辑模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:17:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-02 11:17:01
 */
@NgModule({
    declarations: [DeliveryEditComponent],
    imports: [
        CommonModule
        , CommonEditModule
        , SuiSupplierModule
        , SuiGoodsModule
        , RouterModule.forChild([
            { path: "", component: DeliveryEditComponent },
        ])
    ],
    exports: [],
    providers: [DeliveryEditService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class DeliveryEditModule { }