
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

import { MonitorComponent } from './monitor.component';
import { MonitorService } from './monitor.service';

import { HttpClientModule } from '@angular/common/http';

/**
 * 售卖机监控模块
 * @Created by: yangr 
 * @Created Date: 2017-12-11 11:56:25 
 * @Last Modified by:   yangr 
 * @Last Modified time: 2017-12-11 11:56:25 
 */

@NgModule({
    declarations: [ MonitorComponent ],
    imports: [ CommonModule, 
                CommonListModule,
                RouterModule.forChild([
                    {path: "", component: MonitorComponent}
                ])
            ],
    exports: [ MonitorComponent ],
    providers: [ MonitorService ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class MonitorModule { }