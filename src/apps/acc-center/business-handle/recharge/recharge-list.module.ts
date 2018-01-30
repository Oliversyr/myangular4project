/*
@Description: 账户中心 - 充值记录 recharge
 * @Author: cheng
 * @Date: 2018-01-26 10:14:14
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-29 17:50:55
 */

import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';

import { RechargeListComponent } from './recharge-list.component';
import { RechargeListService } from './recharge-list.service';
import { RechargeAddService } from './recharge-add.service';

import { SuiAccCustomerModule } from '../../../../common/business-zdb-components/base/acc-customer/sui-acc-customer.module';
// import {  RechargeAddModule } from './recharge-add.module';
import {  RechargeAddComponent } from './recharge-add.component';


@NgModule({
    declarations: [RechargeListComponent, RechargeAddComponent],
    imports: [CommonModule,
        CommonListModule, 
        SuiAccCustomerModule,
        // RechargeAddModule,
        RouterModule.forChild([
            { path: '', component: RechargeListComponent }
        ])
    ],
    exports: [],
    providers: [RechargeListService, RechargeAddService],
    schemas: [NO_ERRORS_SCHEMA]
})

export class RechargeListModule{ }
