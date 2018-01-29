
import { NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SuiAccCustomerModule } from '../../../../common/business-zdb-components/base/acc-customer/sui-acc-customer.module';

import { OffwithdrawListComponent } from './offwithdraw-list.component';
import { OffwithdrawListService } from './offwithdraw-list.service';

// import { SubAcctTransferModule } from './subacct-transfer.module';


/**
 * 线下提现列表模块
 * @Created by: lizw
 * @Created Date: 2018-01-24
 */

@NgModule({
    declarations: [OffwithdrawListComponent],
    imports: [
        CommonModule,
        CommonListModule,
        SuiAccCustomerModule,
        RouterModule.forChild([
            { path: '', component: OffwithdrawListComponent },
        ]),
        // SubAcctTransferModule
    ],
    exports: [],
    providers: [OffwithdrawListService],
    schemas: [NO_ERRORS_SCHEMA]
})

export class OffwithdrawListModule { }