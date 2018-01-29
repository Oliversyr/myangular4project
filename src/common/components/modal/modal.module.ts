import { ModalService } from './modal.service';
import { Modal } from './modal';
import { ModalAlert } from './modal-alert';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { jqxNotificationComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxnotification';
import { ModalToast } from './modal-toast';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [ 
        CommonModule
     ],
    exports: [ 
        ModalAlert,
        ModalToast,
       /*  jqxNotificationComponent,
        jqxWindowComponent, */
        Modal
     ],
    declarations: [ 
        ModalAlert,
        ModalToast,
        jqxNotificationComponent,
        jqxWindowComponent
        ,Modal
     ],
     providers:[
        ModalService
     ]
})
export class ModalModule { }