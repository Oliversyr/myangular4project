
import { BaseDetailService } from './../../../../../common/top-common/base-detail.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { NgModule, Component, ElementRef,ViewChild} from '@angular/core';
import { OnInit} from '@angular/core';
import { CommonModule ,DatePipe} from '@angular/common'
import { TemplateDetailOption } from '../../../../../common/components/templates/template-detail';
import { SubAcctDetailService } from './subacct-detail.service';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { GridSortOption } from './../../../../../common/components/grid/grid-sort';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { BaseDetailComponent } from '../../../../../common/top-common/base-detail.component';
import { ModalService } from './../../../../../common/components/modal/modal.service';
/**
 * 搜索参数
 */
interface SubAcctInfo {
    subacctid: string;
    acctno:string;
    bdate: string;
    edate: string;
    sheettype: number;
    querykey: string;
}
/**
 * 账户详情
 * @Created by: gzn 
 * @Created Date: 2018-01-22
 */

@Component({
    templateUrl: './subacct-detail.html',
    styleUrls: [ './subacct-detail.scss' ]
})

export class SubAcctDetailComponent extends BaseDetailComponent implements OnInit {
    /**
     * template-detail配置参数
     */
    option: TemplateDetailOption;
    /**
     * 账号详情
     */
    subAcctInfo: any={};
    /**
     * 搜索参数
     */
    searchParam: SubAcctInfo;
    /**
     * 单据类型
     */
    sheetData: Array<any> = [];
    /**
     * 列表配置参数
     */
    private gridOption: GridOption<any>;
    /**
     * 查询时间参数
     */
    private dateValue: any={};
    /**
     * 表格底部信息
     */
    private gridFooter: any={};
    /**
     * 列表分页参数
     */
    private gridPage: GridPage;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];
    /**
     * 查询工具栏
     */
    private queryTools: ToolBarButton[];
    /** 
     * 表格的表头自定义排序配置信息 
     */
    sorts: GridSortOption[] = [];
    /**
     * 表格
     */
    @ViewChild('grid') mygrid;
    /** 
     * 转账弹出框
     */
    @ViewChild('elwinTransfer') el_winTransfer;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseDetailService: BaseDetailService,
        private myService: SubAcctDetailService,
        private datePipe:DatePipe,
        private modalService:ModalService
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        let param = {
            subacctid:this.tab.routerParam.subacctid,
            acctno:this.tab.routerParam.acctno
        }
        super.requestConfigBeforePageInit([this.myService.getSubAcctDetail(param)])
        .subscribe(data => {
            let  type = data[0].data.result.accttype;
            data[0].data.result.acctTytpe = type == 1 ? '企业账户':type == 2 ? '个人账户':type == 3 ? 
                                                     '企业、个人账户':'未知账户';
            this.subAcctInfo = data[0].data.result;
            this.initToolbar();
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadPageInitData();
        this.initSearchParam();
        this.initGrid();
        this.option = {
            tab: this.tab
        }
    }
    /**
     * 表格初始化完成后执行
     */
    ngAfterViewInit() {
        this.initGridColumns();
    } 
    
     /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        this.sheetData = [
            { value: -1, label: '全部' },
            { value: 1, label: '提现' },
            { value: 2, label: '充值' },
            { value: 3, label: '扣款' },
            { value: 4, label: '收款' },
            { value: 5, label: '转账' }
        ]
        this.searchParam = {
            subacctid: this.tab.routerParam.subacctid,
            acctno:this.tab.routerParam.acctno,
            bdate:  this.dateValue.beginDate,
            edate:  this.dateValue.endDate,
            sheettype: -1,
            querykey:  '',
        }
    }
    /**
     * 初始化表格插件
     */
    private initGrid() {
        let extraBtns = [
            { name: "forbid", label: "禁用", placeholder: "禁用", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "restart", label: "启用", placeholder: "启用", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "detail", label: "明细", placeholder: "明细", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "transfer", label: "转账", placeholder: "转账", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
        ]

        this.gridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight, extraBtns),
            primaryKeyFields: ["acctno","acctid","custid","name","subacctid","subacctname","balance","usablevalue","status"]
        };

        this.gridOption.loadDataInterface = (param) => {
            this.mygrid.clearselection();
            if(!this.dateValue.beginDate){//默认为当前日期
                this.searchParam.bdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                this.searchParam.edate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            }
            return this.myService.getGridData(param, this.searchParam)
        };
        this.sorts = [
            { field: "createtime", label: "发生时间" },
            { field: "amount", label: "发生金额" }
        ];
    }
    /**
     * 初始化表格列
     */
    private initGridColumns(){
        let columnTemplate = {
            sheettype: '<span>${value==1 ? "提现" : value==2 ? "充值" : value==3 ? "扣款" : value==4 ? "收款" : value==5 ? "转账" : "未知类型"}</span>',
        };

        let columndef = [
            { "text": "交易单号", "datafield": "runningid", "align": "center", "width": 200, pinned: true },
            { "text": "交易类型", "datafield": "sheettype", "align": "center", "width": 150,columntype: 'template'},
            { "text": "交易前余额", "datafield": "frontval", "align": "center", "width": 120 },
            { "text": "交易金额", "datafield": "amount", "align": "center", width: 120 },
            { "text": "交易时间", "datafield": "createtime", "align": "center", width: 180 },
            { "text": "往来账户", "datafield": "refacctname", "align": "center", "width": 180 },
            { "text": "结余金额", "datafield": "restval", "align": "center", "width": 120},
            { "text": "摘要", "datafield": "remark", "align": "center", "width": 274},
            { "text": "备注", "datafield": "notes", "align": "center","width": 274,}
        ];
        this.mygrid.setColumns(columndef, [],columnTemplate);
        this.mygrid.load();
        this.getTotal();
    }

    /**
     * 初始化工具栏
     */
    private initToolbar() {
        let extraBtns = [{
            name: 'forbid',
            label: '禁用',
            placeholder: '禁用',
            state: this.subAcctInfo['status'] === 1,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'B'
        },{
            name: 'restart',
            label: '启用',
            placeholder: '启用',
            state: this.subAcctInfo['status'] === 2,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'B'
        },{
            name: 'transfer',
            label: '转账',
            placeholder: '转账',
            state: this.subAcctInfo['status'] === 1,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'B'
        }
    ]

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);
        let toolBarStatus = {'stop': true, 'start': true, 'edit,add,copy,cancel,print,del,editComplete,preNext,check': false};
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }
    /**
     * 按钮栏按钮点击
     */
    
    /**
     * 禁用
     * @param obj 
     */
    doForbid(obj) {
        let param = {
            title:"禁用",
            items: obj.entitys || [],
            method:'doStop'

        }
        this.doOperateSubAcct(param);
    }
    /**
     * 启用
     * @param obj 
     */
    doRestart(obj) {
        let param = {
            title:"启用",
            items: obj.entitys || [],
            method:'doStart'

        }
        this.doOperateSubAcct(param);
       
    }
    /**
     * 操作账户(启用/禁用)
     * @param param 
    */
    doOperateSubAcct(param){
        let thisData = param.items;
        let message = '您确定'+param.title+'该账户？',
        title = '操作确认',
        msgType = 'info';
        this.modalService.modalConfirm(message, title, msgType).subscribe((retCode: string): void => {
            if(retCode === 'OK'){
                this.myService[param.method](thisData).subscribe((res) => {
                    if (res.retCode === 0) {
                        this.baseService.modalService.modalToast(res.message);
                        this.mygrid.load();
                        this.loadPageInitData();
                        this.getTotal();
                    }
                });
            }
        });
    }
    doTransfer(){
        //先获取转入列表再打开弹出框
        this.getReceiveAccList();
    }
    getReceiveAccList(){
        var param = {
            pageNum : 1,
            pageSize : 2147483647,
            totalCount : 0
            
        }
        var searchParam = {
            acctid:this.subAcctInfo.acctid
        }
        let items: any[]=[];
        this.myService.getSubAcctList(param, searchParam).subscribe((data: any) => {
            data.rows.forEach((element,index) => {
                if(element.subacctid != this.subAcctInfo.subacctid){
                    var acc = {
                        value:element.subacctid,
                        label:element.subacctid+'-'+element.subacctname,
                        subAcc:element                  
                    }
                    items.push(acc)
                }
                if(index == data.rows.length-1){
                    var param= {
                        items : items,
                    }
                    Object.assign(param,this.subAcctInfo)
                    this.el_winTransfer.open(param);
                }
            });
        });
    }
    /**
     * 搜索工具栏
     */
    doQuery(){
        this.searchParam.bdate = this.dateValue.beginDate;
        this.searchParam.edate = this.dateValue.endDate;
        this.mygrid.load();
        this.getTotal();
    }
    doReset(){
        this.searchParam.sheettype = -1;
        this.searchParam.querykey = '';
        this.dateValue.beginDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        this.dateValue.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        this.mygrid.load();
        this.getTotal();
    }
    /**
     * 获取底部统计信息
     */
    getTotal(){
        setTimeout(_=>{
            this.gridFooter.incometotal = this.mygrid.footer.incometotal;
            this.gridFooter.expendtotal = this.mygrid.footer.expendtotal;
        },300)
    }
    
}