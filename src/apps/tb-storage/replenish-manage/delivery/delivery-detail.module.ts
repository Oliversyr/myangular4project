import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { DeliveryDetailComponent } from './delivery-detail.component';
import { DeliveryDetailService } from './delivery-detail.service';
import { CommonDetailModule } from '../../../../common/business-groups/common-detail.module';

/*
 * 配送单详情模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:13:05 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-09 18:47:13
 */
@NgModule({
    declarations: [DeliveryDetailComponent],
    imports: [
        CommonModule
        , CommonDetailModule
        , RouterModule.forChild([
            { path: "", component: DeliveryDetailComponent },
        ])
    ],
    exports: [],
    providers: [DeliveryDetailService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class DeliveryDetailModule { }