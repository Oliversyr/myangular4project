import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { CommonEditModule } from '../../../../common/business-groups/common-edit.module';
import { SuiGoodsModule } from '../../../../common/business-components/base/goods/sui-goods.module';
import { SuiSupplierModule } from '../../../../common/business-components/base/supplier/sui-supplier.module';
import { ReplenishEditComponent } from './replenish-edit.component';
import { ReplenishEditService } from './replenish-edit.service';

/*
 * 补货申请编辑模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:17:02 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-08 18:31:26
 */
@NgModule({
    declarations: [ReplenishEditComponent],
    imports: [
        CommonModule
        , CommonEditModule
        , SuiSupplierModule
        , SuiGoodsModule
        , RouterModule.forChild([
            { path: "", component: ReplenishEditComponent },
        ])
    ],
    exports: [],
    providers: [ReplenishEditService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ReplenishEditModule { }