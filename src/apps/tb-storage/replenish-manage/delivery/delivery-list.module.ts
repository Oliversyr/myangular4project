import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { DeliveryListComponent } from './delivery-list.component';
import { DeliveryService } from './delivery.service';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';
import { SuiGoodsModule } from './../../../../common/business-components/base/goods/sui-goods.module';
import { PrintModule } from '../../../../common/components/print/print';
import { SuiExportModule } from '../../../../common/components/export/sui-export';
import { DeliveryListService } from './delivery-list.service';
import { DeliveryAddComponent } from './delivery-add.component';
import { DeliveryShareModule } from './delivery-share.module';

/*
 * 配送单列表模块
 * @Author: xiahl 
 * @Date: 2017-12-25 14:26:09 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-09 16:05:36
 */
@NgModule({
    declarations: [DeliveryListComponent],
    imports: [
        CommonModule
        , CommonListModule
        , SuiOrganModule
        , SuiGoodsModule
        , PrintModule
        , SuiExportModule
        , DeliveryShareModule
        , RouterModule.forChild([
            { path: "", component: DeliveryListComponent },
        ])
    ],
    exports: [],
    providers: [DeliveryListService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class DeliveryListModule { }