
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { NgModule,NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonListModule } from '../../../../common/business-groups/common-list.module';
import { SubAcctListService } from './subacct-list.service';
import { SucbacctTransferComponent } from './subacct.transfer.component'
import { SuiValidatorModule } from '../../../../common/components/validator/sui-validator';

/**
 * 账户列表模块
 * @Created by: gzn 
 * @Created Date: 2018-01-22
 */

@NgModule({
    declarations: [ SucbacctTransferComponent],
    imports: [ 
                CommonModule, 
                CommonListModule,
                SuiValidatorModule
            ],
    exports: [SucbacctTransferComponent],
    providers: [ SubAcctListService ],
    schemas: [ NO_ERRORS_SCHEMA ]
})

export class SubAcctTransferModule { }