/*
@Description: 账户中心 - 充值记录 recharge
 * @Author: cheng
 * @Date: 2018-01-26 10:14:14
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-26 11:51:27
 */

import { NgModule, Component, ElementRef, Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { BaseListService } from '../../../../common/top-common/base-list.service';

import { RechargeListComponent } from './recharge-list.component';
import { RechargeListService } from './recharge-list.service';
// import { StockPdykAddService } from './recharge-add.service';
// import {  StockPdykAddComponent } from './recharge-add.component';

@NgModule({
    declarations: [RechargeListComponent],
    imports: [CommonModule, CommonListModule,
        RouterModule.forChild([
            { path: '', component: RechargeListComponent }
        ])
    ],
    exports: [RechargeListComponent],
    providers: [RechargeListService],
    schemas: [NO_ERRORS_SCHEMA]
})

export class RechargeListModule{ }
