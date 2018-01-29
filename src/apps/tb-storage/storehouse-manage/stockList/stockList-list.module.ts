
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseEditService } from '../../../../common/top-common/base-edit.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { BaseListComponent } from "../../../../common/top-common/base-list.component";
import { CommonListModule } from '../../../../common/business-groups/common-list.module';

import { StockListComponent } from './stockList-list.component';
import { AdjustInventoryComponent } from './adjust-inventory/adjust-inventory.component';
import { StockListService } from './stockList-list.service';
import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';
import { SuiGoodsModule } from '../../../../common/business-components/base/goods/sui-goods.module';

/**
 * 仓库管理模块
 * @Created by: yangr 
 * @Created Date: 2017-12-11 11:56:25 
 * @Last Modified by: yangr
 * @Last Modified time: 2018-01-03 14:42:48
 */

@NgModule({
    declarations: [ StockListComponent, AdjustInventoryComponent ],
    imports: [ CommonModule, 
                CommonListModule,
                SuiOrganModule,
                SuiGoodsModule,
                RouterModule.forChild([
                    {path: "", component: StockListComponent},
                    // {path: "manageShop", component: ManageShopComponent}
                ])
            ],
    exports: [ StockListComponent ],
    providers: [ StockListService ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class StockListModule { }