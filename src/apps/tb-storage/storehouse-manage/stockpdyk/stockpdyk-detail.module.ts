/*
@Description: StorepdykListModule 库存盘点列表
 * @Author: cheng
 * @Date: 2017-12-26 19:28:47
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-18 11:50:30
 */
import { FormsModule } from '@angular/forms';
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


import { StockPdykDetailService } from './stockpdyk-detail.service';
import { StockPdykDetailComponent } from './stockpdyk-detail.component';




@NgModule({
    declarations: [ StockPdykDetailComponent ],
    imports: [ CommonModule,
                CommonDetailModule,
                SuiGoodsModule,
                RouterModule.forChild([
                    {path: '', component:  StockPdykDetailComponent}
                ])
            ],
    exports: [  StockPdykDetailComponent],
    providers: [StockPdykDetailService],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class  StockPdykDetailModule { }
