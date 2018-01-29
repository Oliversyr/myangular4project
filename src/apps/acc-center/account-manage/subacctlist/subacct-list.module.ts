
import { NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SuiAccCustomerModule } from '../../../../common/business-zdb-components/base/acc-customer/sui-acc-customer.module';
import { SubAcctListComponent } from './subacct-list.component';
import { SubAcctListService } from './subacct-list.service';
import { SubAcctTransferModule } from './subacct-transfer.module'

/**
 * 账户列表模块
 * @Created by: gzn 
 * @Created Date: 2018-01-17
 */

@NgModule({
    declarations: [ SubAcctListComponent],
    imports: [ 
                CommonModule, 
                CommonListModule,
                SuiAccCustomerModule,
                RouterModule.forChild([
                    {path: "", component: SubAcctListComponent},
                ]),
                SubAcctTransferModule
            ],
    exports: [ ],
    providers: [ SubAcctListService ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class SubAcctListModule { }