
import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseEditService } from '../../../../../common/top-common/base-edit.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { BaseListComponent } from "../../../../../common/top-common/base-list.component";
import { CommonDetailModule } from '../../../../../common/business-groups/common-detail.module';

import { OutInputDetailComponent } from './outInput-detail.component';
import { OutInputDetailService } from './outInput-detail.service';
import { OutInputService } from './../outInput.service';
import { SuiOrganModule } from '../../../../../common/business-components/base/organ/sui-organ.module';
import { SuiGoodsModule } from '../../../../../common/business-components/base/goods/sui-goods.module';
import { SuiCustomerModule } from '../../../../../common/business-components/base/customer/sui-customer.module';
import { SuiSupplierModule } from '../../../../../common/business-components/base/supplier/sui-supplier.module';

/**
 * 商品出入库单编辑模块
 * @Created by: yangr 
 * @Created Date: 2017-12-11 11:56:25 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-05 18:38:04
 */

@NgModule({
    declarations: [ OutInputDetailComponent ],
    imports: [ CommonModule, 
                CommonDetailModule,
                SuiOrganModule,
                SuiGoodsModule,
                SuiCustomerModule,
                SuiSupplierModule,
                RouterModule.forChild([
                    {path: "", component: OutInputDetailComponent},
                    // {path: "manageShop", component: ManageShopComponent}
                ])
            ],
    providers: [ OutInputDetailService, OutInputService ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class OutInputDetailModule { }