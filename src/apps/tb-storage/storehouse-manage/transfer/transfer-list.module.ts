import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { TransferListComponent } from './transfer-list.component';
import { TransferService } from './transfer.service';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';
import { SuiGoodsModule } from './../../../../common/business-components/base/goods/sui-goods.module';
import { PrintModule } from '../../../../common/components/print/print';
import { SuiExportModule } from '../../../../common/components/export/sui-export';
import { TransferListService } from './transfer-list.service';
import { TransferShareModule } from './transfer-share.module';

/*
 * 调拨单列表模块
 * @Author: xiahl 
 * @Date: 2017-12-25 14:26:09 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-05 16:58:21
 */
@NgModule({
    declarations: [TransferListComponent],
    imports: [
        CommonModule
        , CommonListModule
        , SuiOrganModule
        , SuiGoodsModule
        , PrintModule
        , SuiExportModule
        , TransferShareModule
        , RouterModule.forChild([
            { path: "", component: TransferListComponent },
        ])
    ],
    exports: [],
    providers: [TransferListService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class TransferListModule { }