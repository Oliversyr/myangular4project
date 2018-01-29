/*
@Description: 库存盘点录入
 * @Author: cheng
 * @Date: 2018-01-04 18:50:08
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-18 21:19:11
 */
import { FormsModule } from '@angular/forms';
import { CommonEditModule } from './../../../../common/business-groups/common-edit.module';

import { NgModule, Component, ElementRef,  Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { CommonDetailModule } from './../../../../common/business-groups/common-detail.module';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseEditService } from '../../../../common/top-common/base-edit.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { SuiGoodsModule } from '../../../../common/business-components/base/goods/sui-goods.module';
import { BatchResultAlertModule } from '../../../../common/business-components/base/batch-result-alert/batch-result-alert';


import { StockPdykEditService } from './stockpdyk-edit.service';
import { StockPdykEditComponent } from './stockpdyk-edit.component';
import { NgModel } from '@angular/forms/src/directives/ng_model';

@NgModule({
    declarations: [ StockPdykEditComponent],
    imports: [
        CommonModule,
        CommonEditModule,
        SuiGoodsModule,
        BatchResultAlertModule,
        RouterModule.forChild([
            {path: '', component:  StockPdykEditComponent}
        ])
    ],
    exports: [StockPdykEditComponent],
    providers: [StockPdykEditService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class StockPdykEditModule{}
