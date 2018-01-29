import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { TransferDetailComponent } from './transfer-detail.component';
import { TransferDetailService } from './transfer-detail.service';
import { CommonDetailModule } from '../../../../common/business-groups/common-detail.module';
import { TransferShareModule } from './transfer-share.module';

/*
 * 调拨单详情模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:13:05 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-02 11:19:58
 */
@NgModule({
    declarations: [TransferDetailComponent],
    imports: [
        CommonModule
        , CommonDetailModule
        , TransferShareModule
        , RouterModule.forChild([
            { path: "", component: TransferDetailComponent },
        ])
    ],
    exports: [],
    providers: [TransferDetailService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class TransferDetailModule { }