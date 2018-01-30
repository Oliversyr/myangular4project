import { Component, OnInit, Input, Output, ViewChild, ViewEncapsulation, EventEmitter } from '@angular/core';
import { TopCommon } from '../../../../common/top-common/top-common';
import { Modal } from '../../../../common/components/modal/modal';
import { SuiSelect } from '../../../../common/components/input/sui-select';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { OffwithdrawListService } from './offwithdraw-list.service';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { SuiValidator } from '../../../../common/components/validator/sui-validator';

/*
 * 线下提醒 - 新增/编辑
 * @Author: lizw
 * @Date: 2018-01-26
 */
interface beseParam {
    sheetid?: number;	// 单据号
    acctno?: string;     // 账号
    acctid?: number;     // 账号ID
    name?: string;      // 运营名称
    subacctid?: number;  // 子账号ID
    amount?: number;     // 提现金额
    paymentno?: string;  // 提现凭证号
    notes?: string;      // 备注
    savetype?: number;   // 保存类型 1-保存 2-保存并审核
    type?: string;      // 操作类型
}

@Component({
    selector: 'offwithdraw-add',
    templateUrl: './offwithdraw-add.html',
    styleUrls: ['./offwithdraw-add.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OffwithdrawAddComponent extends TopCommon implements OnInit {
    /**
     * 热键
     */
    hotkeys: any = HOTKEYS;
    /**
     * 参数
     */
    beseParam: beseParam = {};
    /**
     * 转入提现账户列表
     */
    subaccList: any = [];
    /**
     * 提现账户默认值
     */
    subSelectedItem: any = {};
    /**
     * 客户默认值
     */
    defSelectedItem: any = {};
    /**
     * 提现配置
     */
    cfginfo: any = {};
    /**
     * 操作类型
     */
    type: string;
    /**
     * 客户自动补全选择框
     */
    @ViewChild('customerSelect') customerSelect;
    /**
     * 基本信息校验
     */
    @ViewChild('el_mainValidator') el_mainValidator: SuiValidator;

    @Input() title: string = '线下提现';
    @Output() doEmitter: EventEmitter<Object> = new EventEmitter<Object>();
    @ViewChild('windowReference') modalWindow: Modal;

    constructor(private myService: OffwithdrawListService, private modalService: ModalService) {
        super();
    }

    ngOnInit() { }

    /** 初始化参数 */
    doReset() {
        this.beseParam = {
            acctno: '',
            paymentno: '',
            notes: '',
            name: '',
            savetype: 1
        };
        this.subaccList = [];
        this.customerSelect.clearSelection();
        this.subSelectedItem = {};
    }

    /** 打开弹出框 */
    open(type, cfginfo, param) {
        this.doReset();
        this.type = type;
        this.cfginfo = cfginfo;
        if (type === 'ADD') {
            if (cfginfo.isonlyopen4plat) {
                this.beseParam = {
                    acctno: cfginfo.platacctno,
                    acctid: cfginfo.platacctid,
                    name: cfginfo.platname,
                    subacctid: cfginfo.platsubacctid,
                    paymentno: '',
                    notes: '',
                    savetype: 1
                };
                this.getSubaccList();
            } else {

            }
        } else if (type === 'EDIT') {
            this.beseParam.sheetid = param.sheetid;
            this.beseParam.acctid = param.acctid;
            this.beseParam.acctno = param.acctno;
            this.beseParam.name = param.name;
            this.beseParam.subacctid = param.subacctid;
            this.beseParam.amount = param.amount;
            this.beseParam.paymentno = param.paymentno;
            this.beseParam.notes = param.notes;
            this.defSelectedItem = { acctid: this.beseParam.acctid, acctno: this.beseParam.acctno, name: this.beseParam.name };
            this.getSubaccList();
            console.info( this.defSelectedItem , '========  this.defSelectedItem  =========')
        }
        this.modalWindow.open();
    }

    getSubaccList() {
        const param = {
            acctno: this.beseParam.acctno,
            acctid: this.beseParam.acctid,
            subacctid: this.beseParam.subacctid || '',
            subaccttype: 'universal',
            status: 1
        };
        this.myService.getSubAcctList(param).subscribe((res) => {
            this.subaccList = res;
            this.beseParam.subacctid = this.subaccList[0].subacctid;
        });
    }

    subSelect(obj) {
        this.subSelectedItem = obj.args.item.originalItem;
    }

    /**
     * 客户选择
     */
    selectedCustomer(org) {
        console.info(org, '======== org =========')
        this.beseParam.acctid = org[0].acctid;
        this.beseParam.acctno = org[0].acctno;
        this.beseParam.subacctid = org[0].subacctid;
        this.beseParam.name = org[0].name;
        this.getSubaccList();
    }

    /** 关闭弹出框 */
    cancel() {
        this.modalWindow.close();
    }

    /** 确定转账 */
    confirm(savetype) {
        const amount = parseFloat(this.beseParam.amount + '') || 0;
        if (!this.beseParam.acctid) {
            this.modalService.modalToast('请选择客户！', 'info', 2000);
            return;
        }
        if (amount <= 0 || amount > parseFloat(this.subSelectedItem.usablevalue)) {
            this.modalService.modalToast('转账金额必须大于0且小于或等于可用余额！', 'error', 2000);
            return;
        }
        this.el_mainValidator.pass().subscribe(isPass => {
            if (isPass) {
                this.beseParam.savetype = savetype;
                this.beseParam.type = this.type;
                this.doEmitter.emit(this.beseParam);
            } else {
                this.modalService.modalToast('请完整填写数据信息！', 'info', 2000);
            }
        });

    }

}