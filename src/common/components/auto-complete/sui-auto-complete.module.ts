import { StorageModule } from './../../services/storage/storage.module';
import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonServicesModule } from './../../services/groups/common-services.module';
import { SuiAutoComplete } from "./sui-auto-complete";
import { SuiAutoCompleteService } from "./sui-auto-complete.service";
import { ModalModule } from '../modal/modal.module';


@NgModule({
     
    imports: [ 
        CommonModule,
        CommonServicesModule,
        ModalModule,
        StorageModule
    ],
    exports: [ 
        SuiAutoComplete
    ],
    declarations: [ 
        SuiAutoComplete
    ]
    ,providers:[
        SuiAutoCompleteService
    ]
    ,schemas: [ NO_ERRORS_SCHEMA ]
})
export class SuiAutoCompleteModule { }