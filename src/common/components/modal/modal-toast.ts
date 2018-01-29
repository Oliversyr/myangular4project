import { jqxNotificationComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxnotification';
import { ModalToastOption } from './modal-toast-option';
import { Component, OnInit, AfterViewInit, AfterContentInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalService } from './modal.service';
import { CommonModule } from '@angular/common';
import { CommonServices, CommonServicesModule } from './../../services/groups/common-services.module';
import { TopCommon } from './../../top-common/top-common';

/**
 * 
 * 提示框组件 自动关闭
 */
@Component({
    selector: "sui-modal-toast",
    templateUrl: './modal-toast.html'
    // ,styleUrls: ['./print.scss']
})
export class ModalToast extends TopCommon implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    
    msgOption: ModalToastOption;
    @ViewChild('msgNotification') msgNotification: jqxNotificationComponent;

    
    constructor(
        private uitls: CommonServices,
        private modalService: ModalService
    ) { 
        super();
    }

    ngOnInit() {
        //设置默认值
        this.msgOption = this.modalService.getDefModalToastOption();
    }

    /**
     * 显示提示框
     * msgType  消息类型: info,warning,success,error,mail,time,null 
     * @param {string} message 显示消息
     * @param {string=info} msgType  消息类型: info,warning,success,error,mail,time,null 
     * @param {number=3000} delayTimes 提示框显示时间(毫秒)
     */
    open(message: string, msgType?: string, delayTimes?: number) {
        //设置默认值
        this.msgOption = this.modalService.getDefModalToastOption();
        this.msgOption.message = message;
        if(msgType) {
            this.msgOption.msgType = msgType;
        }
        if(delayTimes) {
            this.msgOption.delayTimes = delayTimes;
        }
        setTimeout(() => {
            this.msgNotification.open();
        },10);
    }

    /**
     * 显示提示框(高级)支持更多条件
     * @param {ModalToastOption} msgOption 
     */
    openAdvance(msgOption: ModalToastOption) {
        //设置默认值
        this.msgOption = this.modalService.getDefModalToastOption();
        for(let key in msgOption) {
            if(msgOption[key]) {
                this.msgOption[key] = msgOption[key] ;
            }
        }
        setTimeout(() => {
            this.msgNotification.open();
        },10);
    }

    ngAfterViewInit() {
    }

    ngAfterContentInit() {

    }
    
    ngOnDestroy() {
        console.debug(this.CLASS_NAME,"ngOnDestroy.......");
    }

}
