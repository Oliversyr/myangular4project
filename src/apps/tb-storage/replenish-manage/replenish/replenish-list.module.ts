import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';
import { SuiGoodsModule } from './../../../../common/business-components/base/goods/sui-goods.module';
import { PrintModule } from '../../../../common/components/print/print';
import { SuiExportModule } from '../../../../common/components/export/sui-export';
import { ReplenishListService } from './replenish-list.service';
import { ReplenishListComponent } from './replenish-list.component';
import { ReplenishShareModule } from './replenish-share.module';

/*
 * 补货申请列表模块
 * @Author: xiahl 
 * @Date: 2017-12-25 14:26:09 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-08 09:54:17
 */
@NgModule({
    declarations: [ReplenishListComponent],
    imports: [
        CommonModule
        , CommonListModule
        , SuiOrganModule
        , SuiGoodsModule
        , PrintModule
        , SuiExportModule
        , ReplenishShareModule
        , RouterModule.forChild([
            { path: "", component: ReplenishListComponent },
        ])
    ],
    exports: [],
    providers: [ReplenishListService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ReplenishListModule { }