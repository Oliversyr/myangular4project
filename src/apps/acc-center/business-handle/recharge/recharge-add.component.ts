/*
@Description: 新增盘点单
 * @Author: cheng
 * @Date: 2017-12-28 17:43:02
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-29 16:02:15
 */
import { Component, ElementRef, ViewChild, TemplateRef, EventEmitter} from '@angular/core';
// tslint:disable-next-line:max-line-length
import { OnChanges, OnInit, AfterViewInit, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopCommon } from '../../../../common/top-common/top-common';
import { HOTKEYS } from './../../../../common/directives/keyboard/hotkeys';
import { ModalService } from './../../../../common/components/modal/modal.service';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { Modal } from '../../../../common/components/modal/modal';

// 自定义服务
import { RechargeAddService } from './recharge-add.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { filter } from 'rxjs/operators/filter';
import { SuiResponse, ResponseRetCode } from '../../../../common/services/https/sui-http-entity';
import { Response } from '@angular/http/src/static_response';
import { SuiAccCustomerComponent } from '../../../../common/business-zdb-components/base/acc-customer/sui-acc-customer.component';



/**
 * 新增参数
 */
interface AddParams {
    acctno:       string;
    acctid:       number;
    subacctid:    number;
    amount:       number;
    rechargemode: string; // brankpay-银行卡 wxpay-微信  alipay-支付宝
    payorderno:   string;
    extinfo?:     string;
    notes?:       string;
    savetype:     number;   
}

/**
 * 更新参数
 */
interface UpdateParams{
    sheetid:      number;
    acctno:       string;
    acctid:       number;
    subacctid:    number;
    amount:       number;
    rechargemode: string; // brankpay-银行卡 wxpay-微信  alipay-支付宝
    payorderno:   string;
    extinfo?:     string;
    notes?:       string;
    savetype:     number;   
}

/**
 * 详情参数
 */
interface DetailParams{
    sheetid:       number;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'sui-recharge-add',
    templateUrl: './recharge-add.html',
    styleUrls: [ './recharge-add.scss' ]
})

export class RechargeAddComponent extends TopCommon implements OnInit, AfterViewInit{

    constructor(
        private baseService: BaseService,
        private rechargeAddService: RechargeAddService
    ) {
        super();
    }
    
    /** 
     * 热键
     */
    public hotkeys: any = HOTKEYS;
    /**
     * 缴费方式 线下充值使用 brankpay-银行卡 wxpay-微信 alipay-支付宝
     */
    public chargeMode: any;
    public routeParam: any;
    public attr: string;
    /**
     * 页面数据
     */
    public headInfo: any;
    public subaccList: any;
    
    /**
     * 选择的客户
     */
    public selectedCus: [any];
    /**
     * 选择的账户
     */
    public selectedAcct: [any];
    /**
     * 防止重复提交
     */
    private isSubmit: boolean;
    /**
     * 新增
     */ 
    public addParams: AddParams;
    
    /**
     * 编辑
     */ 
    public updateParams: UpdateParams;
    
    /**
     * 详情
     */ 
    public detailParams: DetailParams;
    
    private rechargemodeName: any;
    /**
     * 弹窗
     */
    @ViewChild('addRechargeModal') addRechargeModal: Modal;
    @Output() callback = new EventEmitter<{sheetid: number}>();
    /**
     * 客户自动补全选择框
     */
    @ViewChild('customerSelect') customerSelect;
    
    /** 
     * 打开弹出框
     * 根据页面属性初始化数据
     */
    open(param: any, attr: string): void {
        this.attr = attr;
        if (attr == 'A'){
            this.routeParam = {};
        }else{
            this.routeParam = param.entitys[0];
        }
        console.log('参数', param, attr);
        this.resetParams();
        this.loadData();
        this.getSubAcctList();
        this.addRechargeModal.open();
    } 
    

    /** 
     * 关闭弹出框
     */
    cancel(): void {
        this.addRechargeModal.close();
    }
    
    /**
     * 初始化
     */
    ngOnInit() {
        this.initLoaclData();
    }
    
    
    /**
     * 初始化本地静态数据
     */
    private initLoaclData(){
        this.chargeMode = [
            { value: 'brankpay',  label: '银行卡' },
            { value: 'wxpay',     label: '微信'   },
            { value: 'alipay',    label: '支付宝' },
        ];
        this.rechargemodeName = {
            'brankpay': '银行卡',
            'wxpay': '微信',
            'alipay': '支付宝',
        };
        this.headInfo = {};
        this.routeParam = {};
        this.attr = 'A';
        this.subaccList = [];
    }
    
    ngAfterViewInit() {
        
    }

    /**
     * 重置所有数据
     */
    private resetParams(): void {
        let res = this.customerSelect && this.customerSelect.clearSelection();
        this.isSubmit = false;
        let temp = this.routeParam;
        if (this.attr == 'A'){
            this.addParams = {
                acctno:       temp.acctno,
                acctid:       temp.acctid,
                subacctid:    temp.subacctid,
                amount:       -1,
                // brankpay-银行卡 wxpay-微信  alipay-支付宝
                rechargemode: '-1',
                payorderno:   '-1',
                extinfo:      '-1',
                notes:        '-1',
                savetype:     1
            };
        }else if (this.attr == 'M'){
            this.updateParams = {
                sheetid:      temp.sheetid,
                acctno:       temp.acctno,
                acctid:       temp.acctid,
                subacctid:    temp.subacctid,
                amount:       -1,
                // brankpay-银行卡 wxpay-微信  alipay-支付宝
                rechargemode: '-1',
                payorderno:   '-1',
                extinfo:      '-1',
                notes:        '-1',
                savetype:     1
            };
        }else{
            this.detailParams = {
                sheetid:      temp.sheetid
            };
        }
    }

    /**
     * 查询数据
     */
    private loadData(){
        if (this.attr == "B" || this.attr == "M"){
            this.rechargeAddService.doDetail(this.detailParams).subscribe( data => {
                console.log('查询详情', data);
                if (data && data.retCode == ResponseRetCode.SUCCESS){
                    this.headInfo = data.data.result;
                    this.headInfo.rechargemodeName = this.rechargemodeName[this.headInfo.rechargemode];
                }else{
                    this.baseService.modalService.modalToast(data.message);
                }
            });
        }
    }
    
    /**
     * 查询账户并过滤
     */
    private getSubAcctList(): void{
        let param = {
            
        };
        this.subaccList = [];
        this.rechargeAddService.getSubAcctList(param).subscribe( data => {
            console.log(' 查询账户', data);
            if (data && data.retCode == ResponseRetCode.SUCCESS){
                if (Array.isArray(data.data.result) && data.data.result.length > 0){
                   
                }
                this.subaccList = data.data.result;
            }else{
                this.baseService.modalService.modalToast(data.message);
            }
        });
    }

    /**
     * 检查参数
     */
    private checkParam(): boolean{
        let res: string = this.selectedCus && this.selectedCus[0] && this.selectedCus[0].acctid && this.selectedCus[0].acctno;
        if (!res){
            this.baseService.modalService.modalToast('请选择客户!');
            return false;
        }
        res = this.selectedAcct && this.selectedAcct[0] && this.selectedAcct[0].acctid;
        if (!res){
            this.baseService.modalService.modalToast('请选择账户!');
            return false;
        }
        let amount: number = Number(this.headInfo.amount);
        if (isNaN(amount)){
            this.baseService.modalService.modalToast('充值金额输入错误!');
            return false;
        }
        if (amount <= 0){
            this.baseService.modalService.modalToast('充值金额必须大于0!');
            return false;
        }
        if (amount > 9999999.99){
            this.baseService.modalService.modalToast('充值金额不能超过9999999.99元!');
            return false;
        }
        res = this.headInfo.payorderno.toString();
        res = res.trim();
        if (!res || res.length > 64){
            this.baseService.modalService.modalToast('缴费凭证号输入错误!');
            return false;
        }
        return true;
    }
    
    /**
     * 客户选择
     */
    private selectCustomer(arr): void {
        console.log('客户选择', arr);
        this.selectedCus = arr;
    }
    
    /**
     * 账户选择
     */
    private selectAcct(arr): void {
        console.log('账户选择', arr);
        this.selectedAcct = arr;
    }

    /**
     * 客户选择
     */
    private subSelect(arr): void {
        console.log('客户选择', arr, this.headInfo);
        // this.selectedAcct = arr;
    }
    
    /**
     * 保存
     * 
     */
    private doSave(): void{
        if (!this.checkParam()){
            return;
        }
        let msg = '',
        title = this.attr == 'A' ? '新增' : '编辑';

        this.baseService.modalService.modalConfirm('保存', title + '充值记录', 'warning').subscribe( (data: string) => {
            if (data === "OK") {
                this.commitData(title);
            }else{
                return;
            }
        });
    }

    /**
     * 
     * 保存并审核
     */
    private doSaveWithCheck(): void{
        if (!this.checkParam()){
            return;
        }
        let msg = '',
        title = this.attr == 'A' ? '新增' : '编辑';
        this.baseService.modalService.modalConfirm('保存', title + '充值记录', 'warning').subscribe( (data: string) => {
            if (data === "OK") {
                this.commitDataWithCheck(title);
            }else{
                return;
            }
        });
    }
    

    /** 
     * 关闭弹出框
     */
    doCancel(): void {
        this.addRechargeModal.close();
    }



    /**
     * 提交数据
     */
    private commitData(title: string): void {
        this.addParams.savetype = 1;
        this.updateParams.savetype = 1;
        this.rechargeAddService.doAdd(this.addParams).subscribe( (data: SuiResponse<any>) => {
            console.log('提交数据', this.addParams, data);
            if ( data.retCode == ResponseRetCode.SUCCESS) {
                this.baseService.modalService.modalToast(title + '成功');
                this.callback.emit(data.data.result);
                this.addRechargeModal.close();
            }else{
                this.baseService.modalService.modalToast(data.message);
            }
        });
    }

    /**
     * 提交数据并审核
     */
    private commitDataWithCheck(title: string): void {
        this.addParams.savetype = 2;
        this.updateParams.savetype = 2;
        this.rechargeAddService.doUpdate(this.updateParams).subscribe( (data: SuiResponse<any>) => {
            console.log('提交数据并审核', this.updateParams, data);
            if ( data.retCode == ResponseRetCode.SUCCESS) {
                this.baseService.modalService.modalToast(title + '成功');
                this.callback.emit(data.data.result);
                this.addRechargeModal.close();
            }else{
                this.baseService.modalService.modalToast(data.message);
            }
        });
    }
    
}
