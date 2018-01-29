
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
import { CommonListModule } from '../../../../../common/business-groups/common-list.module';

import { ManageShopComponent } from './manage-shop.component';
import { ManageShopService } from './manage-shop.service';
import { StorehouseService } from './../storehouse.service';
import { SuiOrganModule } from '../../../../../common/business-components/base/organ/sui-organ.module';

import { HttpClientModule } from '@angular/common/http';

/**
 * 管理配送店铺模块
 * @Created by: yangr 
 * @Created Date: 2017-12-11 11:56:25 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-28 15:45:24
 */

@NgModule({
    declarations: [ ManageShopComponent ],
    imports: [ CommonModule, 
                CommonListModule,
                SuiOrganModule,
                RouterModule.forChild([
                    {path: "", component: ManageShopComponent}
                ])
            ],
    exports: [  ManageShopComponent ],
    providers: [ ManageShopService, StorehouseService ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class ManageShopModule { }