
import { NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule ,DatePipe} from '@angular/common'
import { RouterModule } from '@angular/router';
import { CommonDetailModule } from '../../../../../common/business-groups/common-detail.module';
import { CommonListModule } from '../../../../../common/business-groups/common-list.module';
import { CommonEditModule } from './../../../../../common/business-groups/common-edit.module';

import { SubAcctDetailComponent } from './subacct-detail.component';
import { SubAcctDetailService } from './subacct-detail.service';
import { SubAcctTransferModule } from '../subacct-transfer.module'

/**
 * 账户列表模块
 * @Created by: gzn 
 * @Created Date: 2018-01-22
 */

@NgModule({
    declarations: [ SubAcctDetailComponent],
    imports: [ 
                CommonModule, 
                CommonDetailModule,
                CommonListModule,
                CommonEditModule,
                SubAcctTransferModule,
                RouterModule.forChild([
                    {path: "", component: SubAcctDetailComponent},
                ])
            ],
    exports: [ ],
    providers: [ SubAcctDetailService,DatePipe],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class SubAcctDetailModule { }