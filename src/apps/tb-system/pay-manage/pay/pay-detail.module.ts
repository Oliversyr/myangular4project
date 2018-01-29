import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { PayDetailComponent } from './pay-detail.component';
import { PayDetailService } from './pay-detail.service';
import { CommonDetailModule } from '../../../../common/business-groups/common-detail.module';
import { PayShareModule } from './pay-share.module';

/*
 * 支付管理详情模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:13:05 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-25 14:57:35
 */
@NgModule({
    declarations: [PayDetailComponent],
    imports: [
        CommonModule
        , CommonDetailModule
        , PayShareModule
        , RouterModule.forChild([
            { path: "", component: PayDetailComponent },
        ])
    ],
    exports: [],
    providers: [PayDetailService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PayDetailModule { }