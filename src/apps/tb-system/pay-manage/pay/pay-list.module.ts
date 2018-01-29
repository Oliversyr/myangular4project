import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { PayListComponent } from './pay-list.component';
import { PayService } from './pay.service';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';
import { SuiGoodsModule } from './../../../../common/business-components/base/goods/sui-goods.module';
import { PrintModule } from '../../../../common/components/print/print';
import { SuiExportModule } from '../../../../common/components/export/sui-export';
import { PayListService } from './pay-list.service';
import { PayShareModule } from './pay-share.module';

/*
 * 支付列表模块
 * @Author: xiahl 
 * @Date: 2017-12-25 14:26:09 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-26 11:29:29
 */
@NgModule({
    declarations: [PayListComponent],
    imports: [
        CommonModule
        , CommonListModule
        , SuiOrganModule
        , SuiGoodsModule
        , PrintModule
        , SuiExportModule
        , PayShareModule
        , RouterModule.forChild([
            { path: "", component: PayListComponent },
        ])
    ],
    exports: [],
    providers: [PayListService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PayListModule { }