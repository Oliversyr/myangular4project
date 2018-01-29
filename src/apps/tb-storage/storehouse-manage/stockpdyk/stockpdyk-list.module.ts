/*
@Description: StorepdykListModule 库存盘点列表
 * @Author: cheng
 * @Date: 2017-12-26 19:28:47
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-18 11:57:43
 */
import { FormsModule } from '@angular/forms';
import { NgModule, Component, ElementRef,  Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseEditService } from '../../../../common/top-common/base-edit.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';

import { SuiOrganModule } from '../../../../common/business-components/base/organ/sui-organ.module';
import { SuiGoodsModule } from '../../../../common/business-components/base/goods/sui-goods.module';
import { SuiBrandModule } from '../../../../common/business-components/base/brand/sui-brand.module';
import { SuiCategoryModule } from '../../../../common/business-components/base/category/sui-category.module';


import {  StockPdykListComponent } from './stockpdyk-list.component';
import {  StockPdykAddComponent } from './stockpdyk-add.component';
import { StockPdykListService } from './stockpdyk-list.service';
import { StockPdykAddService } from './stockpdyk-add.service';




@NgModule({
    declarations: [  StockPdykListComponent, StockPdykAddComponent],
    imports: [ CommonModule,
                CommonListModule,
                SuiOrganModule,
                SuiGoodsModule,
                SuiBrandModule,
                SuiCategoryModule,
                RouterModule.forChild([
                    {path: '', component:  StockPdykListComponent}
                ])
            ],
    exports: [  StockPdykListComponent],
    providers: [StockPdykListService, StockPdykAddService],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class  StockPdykListModule { }
