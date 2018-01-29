import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { PurchaseInputDetailComponent } from './purchase-input-detail.component';
import { PurchaseInputDetailService } from './purchase-input-detail.service';
import { CommonDetailModule } from '../../../../common/business-groups/common-detail.module';
import { PurchaseInputShareModule } from './purchase-input-share.module';

/*
 * 采购入库详情模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:13:05 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-05 10:14:49
 */
@NgModule({
    declarations: [PurchaseInputDetailComponent],
    imports: [
        CommonModule
        , CommonDetailModule
        , PurchaseInputShareModule
        , RouterModule.forChild([
            { path: "", component: PurchaseInputDetailComponent },
        ])
    ],
    exports: [],
    providers: [PurchaseInputDetailService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PurchaseInputDetailModule { }