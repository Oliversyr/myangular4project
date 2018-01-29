import { Component, OnInit, AfterViewInit, AfterContentInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ModalAlertOption } from './modal-alert-option';
import { jqxWindowComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import { ModalService } from './modal.service';
import { CommonModule } from '@angular/common';
import { CommonServices, CommonServicesModule } from './../../services/groups/common-services.module';
import { TopCommon } from './../../top-common/top-common';


/**
 * 
 * 打印组件
 * 输入属性
 * 1. data -- 打印数据
 * 2. moduleId -- 模块号
 */
@Component({
    selector: "sui-modal-alert",
    templateUrl: './modal-alert.html'
    // ,styleUrls: ['./print.scss']
})
export class ModalAlert extends TopCommon implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

    
    msgOption: ModalAlertOption;
    @ViewChild('el_modal') el_modal: jqxWindowComponent;

    
    constructor(
        private uitls: CommonServices,
        private modalService: ModalService
    ) { 
        super();
    }

    ngOnInit() {
        //设置默认值
        this.msgOption = this.modalService.getDefModalAlertOption();
    }

    /**
     * 设置弹出框标题
     */
    private setWinHeader() {
        let title: string = this.msgOption.title;
        let msgType: string = this.msgOption.msgType;
        if(msgType)  {
            this.el_modal.setTitle(`<span><img src="assets/imgs/modal/${msgType}.png" />${title}</span>`);
        } else {
            this.el_modal.setTitle(`<span>${title}</span>`);

        }
    }

    /**
     * 提示框
     * msgType  消息类型: info,warning,success,error,mail,time,null 
     * @param {string} message 显示消息
     * @param {string} title 标题
     * @param {string=info} msgType  消息类型: info,warning,success,error,mail,time,null 
     * @param {function=} callBackFun 点击确定按钮回调函数
     * @param {string=确定} okLabel  确定按钮名称
     */
    alert(message: string, title: string, msgType?: string, callBackFun?: () => void, okLabel?: string) {
        //设置默认值
        this.msgOption = this.modalService.getDefModalAlertOption();
        this.msgOption.message = message;
        this.msgOption.title = title;
        if(msgType) {
            this.msgOption.msgType = msgType;
        }
        // if(typeof callBackFun === "function") {
        //     this.msgOption.callBackFun = callBackFun;
        // }
        if(okLabel) {
            this.msgOption.okLabel = okLabel;
        }
        
        //无取消按钮
        this.msgOption.cancelLabel = null;
        setTimeout(() => {
            this.el_modal.open();
            this.setWinHeader();
        },10);
    }

    /**
     * 确认框
     * msgType  消息类型: info,warning,success,error,mail,time,null 
     * callBackFun 点击确定按钮回调函数; retCode: OK-确定按钮, CANCEL-取消按钮
     * @param {string} message 显示消息
     * @param {string} title 标题
     * @param {string=info} msgType  消息类型: info,warning,success,error,mail,time,null 
     * @param {function=} callBackFun 点击确定按钮回调函数; retCode: OK-确定按钮, CANCEL-取消按钮,NONE-右上角关闭按钮
     * @param {string=确定} okLabel  确定按钮名称
     * @param {string=取消} cancelLabel  取消按钮名称
     */
    confirm(message: string, title: string, msgType?: string, callBackFun?: ( retCode: string) => void, okLabel?: string, cancelLabel?: string) {
        //设置默认值
        this.msgOption = this.modalService.getDefModalAlertOption();
        this.msgOption.message = message;
        this.msgOption.title = title;
        if(msgType) {
            this.msgOption.msgType = msgType;
        }
        // if(typeof callBackFun === "function") {
        //     this.msgOption.callBackFun = callBackFun;
        // }
        if(okLabel) {
            this.msgOption.okLabel = okLabel;
        }
        if(cancelLabel) {
            this.msgOption.cancelLabel = cancelLabel;
        }
        setTimeout(() => {
            this.el_modal.open();
            this.setWinHeader();
        },10);
    }

    /**
     * 显示提示框(高级)支持更多条件
     * @param {MsgToastOption}msgOption 
     */
    openAdvance(msgOption: ModalAlertOption) {
        //设置默认值
        this.msgOption = this.modalService.getDefModalAlertOption();
        for(let key in msgOption) {
            if(msgOption[key]) {
                this.msgOption[key] = msgOption[key] ;
            }
        }
        setTimeout(() => {
            this.el_modal.open();
            this.setWinHeader();
        },10);
    }

    _onWinClose(event) {
        let retCode: string ;
        if (event.type === 'close') {
            if (event.args.dialogResult.OK) {
                retCode = 'OK';
            } else if (event.args.dialogResult.Cancel) {
                retCode = 'CANCEL';
            } else {
                retCode = 'NONE';
            }
        }
        // if(this.msgOption.callBackFun) {
        //     this.msgOption.callBackFun(retCode);
        // }
        // this.el_modal.close();
    } 

    // doCancel() {
    //     if(this.msgOption.callBackFun) {
    //         this.msgOption.callBackFun("CANCEL");
    //     }
    //     this.el_modal.close();
    // }

    ngAfterViewInit() {
    }

    ngAfterContentInit() {

    }
    
    ngOnDestroy() {
        console.debug(this.CLASS_NAME,"ngOnDestroy.......");
    }

}
