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
import { SuiGroupsModule } from '../../../../common/business-components/base/groups/sui-groups.module';
import { SuiBrandModule } from '../../../../common/business-components/base/brand/sui-brand.module';
import { ReplenishHandleListComponent } from './replenish-handle-list.component';
import { ReplenishHandleService } from './replenish-handle.service';
import { ReplenishHandleListService } from './replenish-handle-list.service';
import { ReplenishShareModule } from '../replenish/replenish-share.module';

/*
 * 补货申请处理列表模块
 * @Author: xiahl 
 * @Date: 2017-12-25 14:26:09 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-09 11:54:55
 */
@NgModule({
    declarations: [ReplenishHandleListComponent],
    imports: [
        CommonModule
        , CommonListModule
        , SuiOrganModule
        , SuiGoodsModule
        , PrintModule
        , SuiExportModule
        , SuiGroupsModule
        , SuiBrandModule
        , ReplenishShareModule
        , RouterModule.forChild([
            { path: "", component: ReplenishHandleListComponent },
        ])
    ],
    exports: [],
    providers: [ReplenishHandleService, ReplenishHandleListService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ReplenishHandleListModule { }