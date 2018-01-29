import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiTreeModule } from '../tree/sui-tree';
import { SuiTransfer } from './sui-transfer.component';

/**
 * Transfer: 穿梭框模块
 *
 */
@NgModule({
    imports: [
        CommonModule,
        SuiTreeModule
    ],
    exports: [
        SuiTransfer
    ],
    declarations: [
        SuiTransfer
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SuiTransferModule { }
