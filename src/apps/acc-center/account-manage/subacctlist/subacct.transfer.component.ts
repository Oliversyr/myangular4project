import {Component, OnInit, Input, Output, ViewChild, ViewEncapsulation, EventEmitter} from '@angular/core';
import { TopCommon } from '../../../../common/top-common/top-common';
import { Modal } from '../../../../common/components/modal/modal';
import { SuiSelect } from '../../../../common/components/input/sui-select';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { SuiValidator } from '../../../../common/components/validator/sui-validator';
import { SubAcctListService } from './subacct-list.service';
import { ModalService } from './../../../../common/components/modal/modal.service';

/*
 * 转账
 * @Author: gzn 
 * @Date: 2018-01-19
 */
interface transferParam {
    payacctno: string;//付款账号
    payacctid:string;//付款账号ID
    paysubacctid: string;//付款账户
    recacctno: string;//收款账号
    recacctid: string;//收款账号ID
    recsubacctid: string;//收款账户
    amount: string;//转账金额
    savetype: number;//保存类型 1-新增 2-新增并审核 固定传2
    notes: string;//备注
}
@Component({
    selector: 'subacct-transfer',
    templateUrl: './subacct.transfer.html',
    styleUrls: ['./subacct.transfer.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SucbacctTransferComponent extends TopCommon implements OnInit {
    /** 热键 */
    hotkeys: any = HOTKEYS;
    /**转入账户列表*/
    receiveAccData:Array<any> = [];
    /**转账参数 */
    transferParam:transferParam;
    /**转出账户的账户信息 */
    payAccountMsg:object;
    rootValidators:Array<any> = []
    /**弹出框打开状态 */
    modalStatus:boolean = false;
    
    @Input() title: string = "内部转账";
    @Output() closeTransfer: EventEmitter<Object> = new EventEmitter<Object>();
    @ViewChild('windowReference') modalWindow: Modal;
    @ViewChild("el_transvalidator") el_transvalidator: SuiValidator;

    constructor(private myService: SubAcctListService,private modalService:ModalService) {
        super();
    }

    ngOnInit() {
        /**初始化参数 */
        this.transferParam = {
            payacctno: '',
            payacctid:'',
            paysubacctid: '',
            recacctno: '',
            recacctid: '',
            recsubacctid: '',
            amount: '',
            savetype: 2,
            notes: '',
        }
        this.receiveAccData = [];

    }
    /**
     * 初始化参数
     */
    initParam (param){
        
    }

    /** 打开弹出框 */
    open(param) {
        this.ngOnInit();
        setTimeout(_=>{//初始化参数
            this.modalStatus = true;
            this.payAccountMsg = param;
            this.transferParam.payacctno = param.acctno
            this.transferParam.payacctid = param.acctid
            this.transferParam.paysubacctid = param.subacctid
            this.receiveAccData = param.items;
        },10)
        this.modalWindow.open();
    }

    /** 关闭弹出框 */
    cancel() {
        this.modalStatus = false;
        this.modalWindow.close();
    }
    /** 确定转账 */
    confirm() {
        //   this.el_transvalidator.pass().subscribe(isPass => {
        //     if (isPass) {
               
            
        //     }
        // })
         let amount = parseFloat(this.transferParam.amount) || 0;
                if(!this.transferParam.recsubacctid){
                    this.modalService.modalToast("请选择转入账户！","info",2000);
                    return 
                }
                if(amount <= 0 || amount>parseFloat(this.payAccountMsg['usablevalue'])){
                    this.modalService.modalToast("转账金额必须大于0且小于或等于可用余额！","error",2000);
                    return 
                } 
                this.receiveAccData.forEach(element=>{
                    if(element.subAcc.subacctid == this.transferParam.recsubacctid){
                        this.transferParam.recacctno = element.subAcc.acctno
                        this.transferParam.recacctid = element.subAcc.acctid
                        this.transferParam.recsubacctid = element.subAcc.subacctid
                    }
                })
                this.myService.doTransfer(this.transferParam).subscribe((res) => {
                    if (res.retCode === 0) {
                        this.modalService.modalToast("转账成功！","success",2000);
                        this.cancel();
                        this.closeTransfer.emit("SUCCESS");
                    }
                });
        
    }
    

}