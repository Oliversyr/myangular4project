import {
    NgModule
    , NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { CommonDetailModule } from '../../../../common/business-groups/common-detail.module';
import { ReplenishDetailComponent } from './replenish-detail.component';
import { ReplenishDetailService } from './replenish-detail.service';

/*
 * 补货申请详情模块
 * @Author: xiahl 
 * @Date: 2017-12-27 17:13:05 
 * @Last Modified by: xiahl
 * @Last Modified time: 2018-01-08 18:31:40
 */
@NgModule({
    declarations: [ReplenishDetailComponent],
    imports: [
        CommonModule
        , CommonDetailModule
        , RouterModule.forChild([
            { path: "", component: ReplenishDetailComponent },
        ])
    ],
    exports: [],
    providers: [ReplenishDetailService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ReplenishDetailModule { }