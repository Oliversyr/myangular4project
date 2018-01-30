/*
@Description: 账户中心-充值记录 列表组件
 * @Author: cheng
 * @Date: 2018-01-26 11:53:37
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-29 14:32:44
 */
import { NgModule, Component, ElementRef, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input, Output } from '@angular/core';
import { OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { DateUtil } from '../../../../common/services/utils/date-util';
import { TemplateDetailOption } from '../../../../common/components/templates/template-detail';
import { TemplateListOption } from '../../../../common/components/templates/template-list';
import { Modal } from '../../../../common/components/modal/modal';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { GridSortOption } from '../../../../common/components/grid/grid-sort';
import { Grid } from '../../../../common/components/grid/grid';

// 自定义服务
import { RechargeListService } from './recharge-list.service';
import { isNumber } from 'util';
import { DateRangeModel } from '../../../../common/components/input/sui-date';
import { SuiResponse, ResponseRetCode } from '../../../../common/services/https/sui-http-entity';
import { RechargeAddComponent } from './recharge-add.component';
/**
 * 搜索参数
 */
interface SearchParams {
    acctno?: string; // 账号
    acctid?: number; // 账号id
    subacctid?: number; // 子账户ID
    checkstatus: number; // 审核状态 -1全部，0待审核，1已审核
    querydatetype: string | any; // 查询时间类型 createtime-创建时间,checktime-审核时间
    bdate: string | Date; // 开始日期
    edate: string | Date; // 结束日期
    querykey?: string | number; // 查询关键字
}

@Component({
    templateUrl: './recharge-list.html',
    styleUrls: ['./recharge-list.scss']
})

export class RechargeListComponent extends BaseListComponent implements OnInit, AfterViewInit {
    private option: TemplateListOption = {};
    private tools: ToolBarButton[];
    private toolBarData: ToolBarButton[];
    // 搜索参数
    private searchParam: SearchParams;
    // 日期
    private dateValue: DateRangeModel;
    private dateLabel: Array<any> = [];
    /**
     * 交易状态
     */
    private statusData: Array<any> = [];
    /**
     * 支付方式 
     */
    private payTypeName: any;
    /**
     * 交易状态名称
     */
    private statusName: any;
    /**
     * 审核状态名称
     */
    private checkStatusName: any;
    /**
     * 缴费方式 线下充值使用 brankpay-银行卡 wxpay-微信 alipay-支付宝
     */
    private chargeModeName: any;
    /**
     * 选择的客户
     */
    private selectedAccount: any;
    
    // 列表配置参数
    private gridOption: GridOption<any> = {};
    sorts: GridSortOption[] = [];

    // 表格
    @ViewChild('grid') mygrid: Grid;
    
    // 新增
    @ViewChild('suiRechargeAdd') suiRechargeAdd: RechargeAddComponent;
    /**
     * 客户自动补全选择框
     */
    @ViewChild('customerSelect') customerSelect;
    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseListService: BaseListService,
        private rechargeListService: RechargeListService,
        private dateUtil: DateUtil
    ) {
        super();
    }

    onStart(param) { }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData(): void {

    }

    /**
     * 初始化
     */
    ngOnInit(): void {
        super.ngOnInit();
        this.initOnceParam();
        this.doReset();
        this.initGrid();
    }

    /**
     * 视图加载完成
     */
    ngAfterViewInit(): void {
        this.initGridColumns();
        this.doSearch();
    }

    /**
     * 初始化本地数据
     */
    private initOnceParam(): void {
        // 支付方式 
        this.payTypeName = {
            'CASHPAY': '线下支付',
            'ALIPAY_SC': '支付宝扫码',
            'ALIPAY_WAP': '支付宝',
            'WXPAYZDB_SC': '微信扫码',
            'WXPAYZDB_OA': '公众号支付'
        };

        this.statusName = {
            0: '待支付',
            1: '正在支付',
            5: '支付失败',
            9: '支付成功'
        };
        
        this.checkStatusName = {
            0: '待审核',
            1: '已审核'
        };
        
        this.chargeModeName = {
            'brankpay': '银行卡',
            'wxpay': '微信',
            'alipay': '支付宝'
        };
        
        this.statusData =  [
            { value: 0, label: '待支付' },
            { value: 1, label: '正在支付' },
            { value: 5, label: '支付失败' },
            { value: 9, label: '支付成功' }
        ];

        this.toolBarData = [{
            name: 'add',
            label: '新建',
            placeholder: '新建',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'A|B|M'
        }];

        // 去掉多余的按钮
        let toolBarStatus = {
            print: false,
            copy: false,
            BATCH: false,
            check: false,
            delete: false,
            cancel: false,
            import: false,
            export: false,
            del: false
        };
        // 设置按钮
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, this.toolBarData);
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
        // 隐藏更多
        this.option = {
            isMoreSearch: false,
            tab: this.tab
        };
    }


    /**
     * 重置搜索条件并重置搜索数据
     */
    doReset(): void {
        this.dateLabel = [
            { value: 'createtime', label: '创建日期' },
            { value: 'checktime', label: '审核日期' }
        ];
        this.dateValue = {
            leftValue: 'createtime',
            beginDate: '123',
            endDate: '123'
        };
        this.searchParam = {
            checkstatus: -1,
            querydatetype: this.dateValue.leftValue,
            bdate: this.dateValue.beginDate,
            edate: this.dateValue.endDate,
        };
        // 清空客户
        let res = this.customerSelect && this.customerSelect.clearSelection();
    }

    /**
     * 表格插入前
     */
    private rowBeforeAdd = (row) => {
        // row.rechargemodeName =  this.chargeModeName[row.rechargemode];
        let rowToolState: any = {};
        rowToolState.check = true;
        rowToolState.edit =  row.checkstatus == 0;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格配置
     */
    private initGrid() {
        // 排序
        this.sorts = [
            { field: 'createtime', label: '创建日期' },
            { field: 'amount', label: '充值金额' }
        ];
        // 操作
        let extraBtns = [
            { name: "edit", label: "编辑", placeholder: "编辑", state: true, useMode: 'GRID_BAR', userPage: "A|M|B" },
            { name: "check", label: "审核", placeholder: "审核", state: true, useMode: 'GRID_BAR', userPage: "A|M|B" }
        ];
        // 表格配置
        this.gridOption = {
            selectionMode: 'none',
            isShowRowNo: true,
            tools: this.baseService.getGridToolBar(this.mRight),
            primaryKeyFields: []
        };
        this.gridOption.loadDataInterface = (param) => this.rechargeListService.getSheet(param, this.searchParam);
        this.gridOption.rowBeforeAdd = this.rowBeforeAdd;
    }

    /**
     * 初始化表格列
     */
    private initGridColumns() {
        const columnDefs = [
            {
                text: '客户编号', 'datafield': 'custid', 'align': 'center', 'width': 200, pinned: true
            },
            {
                text: '客户名称', 'datafield': 'name', 'align': 'center', 'width': '120', pinned: true
            },
            {
                text: '资金账号', 'datafield': 'acctno', 'align': 'center', 'width': '12%'
            },
            {
                text: '充值金额', 'datafield': 'amount', 'align': 'center',  width: '10%', "cellsformat": "c2"
            },
            {
                text: '充值账户', 'datafield': 'subacctid', 'align': 'center', 'width': '12%'
            },
            {
                text: '缴费方式', 'datafield': 'rechargemodeName', 'align': 'center', 'width': '8%'
            },
            {
                text: '缴费凭证号', 'datafield': 'payorderno', 'align': 'center', 'width': '15%'
            },
            {
                text: '备注', 'datafield': 'notes', 'align': 'center', 'width': '10%'
            },
            {
                text: '创建人', 'datafield': 'creator', 'align': 'center', 'width': '8%'
            },
            {
                text: '创建日期', 'datafield': 'createtime', 'align': 'center', 'width': '12%', cellsformat: "yyyy-MM-dd"
            },
            {
                text: '审核人', 'datafield': 'checker', 'align': 'center', 'width': '8%'
            },
            {
                text: '审核日期', 'datafield': 'checktime', 'align': 'center', 'width': '12%', cellsformat: "yyyy-MM-dd"
            },
            {
                text: '操作', 'datafield': 'tools', 'align': 'center', 'width': 100, columntype: 'tools'
            }
        ];

        this.mygrid.setColumns(columnDefs, []);
    }
    
    /**
     * 新增
     */
    doAdd(): void{
        // this.suiClient.open();
        this.openModal({}, this.ATTR.A);
    }

    /**
     * 查询
     */
    doSearch(): void{
        if (this.dateValue.beginDate){
            this.searchParam.bdate = this.dateValue.beginDate;
        }
        if (this.dateValue.endDate){
            this.searchParam.edate = this.dateValue.endDate;
        }
        if (Array.isArray(this.selectedAccount) && this.selectedAccount.length == 1){
            this.searchParam.acctid = this.selectedAccount[0].acctid;
            this.searchParam.acctno = this.selectedAccount[0].acctno;
        }else{
            delete this.searchParam.acctid;
            delete this.searchParam.acctno;
        }
        
        // TODO:客户
        
        this.mygrid.load();
    }
    
    /**
     * 客户选择
     */
    private selectedCustomer(org): void {
        console.log('客户选择', org);
        this.selectedAccount = org;
    }
    
    /**
     * 编辑
     */
    doEdit(item: any): void{
        console.log("编辑", item);
        this.openModal(item, this.ATTR.M);
    }

    /**
     * 详情
     */
    doBrowse(item: any): void{
        console.log("详情", item);
        this.openModal(item, this.ATTR.B);
    }
    
    /**
     * 审核
     */
    doCheck(item: any): void{
        this.doOperate(item, '审核');
    }

    /**
     * 删除
     */
    doDel(item: any): void{
        this.doOperate(item, '删除');
    }
    
    /**
     * 审核 删除 提交数据
     */
    private doOperate(param: any, title: string): void{
        this.baseService.modalService.modalConfirm('确定要' + title + '吗?', title, 'warning').subscribe( (data: string) => {
            if (data === 'OK') {
                this.rechargeListService.doCheck(param).subscribe( (resp: SuiResponse<any>) => {
                    if (resp.retCode == ResponseRetCode.SUCCESS){
                        this.baseService.modalService.modalToast(title + '成功');
                        // 刷新界面
                        this.doSearch();
                    }else{
                        this.baseService.modalService.modalToast(resp.message);
                    }
                });
            }
        }); 
    }
    
    /**
     * 打开弹出框 编辑 详情 新增
     */
    private openModal(param, attr){
        this.suiRechargeAdd.open(param, attr);
    }
    
    /**
     * 弹出框回调
     */
    modalCallBack(data: any){
        console.log("回调", event);
        if(data === 'OK'){
            this.doSearch();
        }
    }

}


