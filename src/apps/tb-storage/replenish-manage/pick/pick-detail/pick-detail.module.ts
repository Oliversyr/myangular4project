
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

import { PickDetailComponent } from './pick-detail.component';
import { PickDetailService } from './pick-detail.service';
import { PickService } from './../pick.service';
import { SuiOrganModule } from '../../../../../common/business-components/base/organ/sui-organ.module';
import { SuiGoodsModule } from '../../../../../common/business-components/base/goods/sui-goods.module';
import { SuiCustomerModule } from '../../../../../common/business-components/base/customer/sui-customer.module';
import { SuiSupplierModule } from '../../../../../common/business-components/base/supplier/sui-supplier.module';
import { AddDeliveryComponent } from './../add-delivery/add-delivery.component';

/**
 * 汇总拣货详情模块
 * @Created by: yangr 
 * @Created Date: 2017-12-11 11:56:25 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-05 18:38:04
 */

@NgModule({
    declarations: [ PickDetailComponent, AddDeliveryComponent ],
    imports: [ CommonModule, 
                CommonDetailModule,
                SuiOrganModule,
                SuiGoodsModule,
                SuiCustomerModule,
                SuiSupplierModule,
                RouterModule.forChild([
                    {path: "", component: PickDetailComponent},
                    // {path: "manageShop", component: ManageShopComponent}
                ])
            ],
    exports: [ AddDeliveryComponent ],        
    providers: [ PickDetailService, PickService ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class PickDetailModule { }