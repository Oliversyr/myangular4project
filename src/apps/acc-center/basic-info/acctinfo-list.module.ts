
import { SuiHttpService } from '../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../common/top-common/base-list.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { CommonListModule } from '../../../common/business-groups/common-list.module';
import { SuiAccCustomerModule } from '../../../common/business-zdb-components/base/acc-customer/sui-acc-customer.module';

import { AcctInfoComponent } from './acctinfo-list.component';
import { AcctInfoListService } from './acctinfo-list.service';

/**
 * 账户资料列表模块
 * @Created by: gzn 
 * @Created Date: 2018-01-23
 */

@NgModule({
    declarations: [ AcctInfoComponent],
    imports: [ 
                CommonModule, 
                CommonListModule,
                SuiAccCustomerModule,
                RouterModule.forChild([
                    {path: "", component: AcctInfoComponent},
                ]),
            ],
    exports: [ ],
    providers: [ AcctInfoListService ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class AcctInfoListModule { }