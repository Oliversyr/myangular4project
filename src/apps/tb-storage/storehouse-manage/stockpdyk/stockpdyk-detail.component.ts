/*
@Description: 库存盘点单详情
 * @Author: cheng
 * @Date: 2018-01-02 17:05:42
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-19 21:36:05
 */
import { FormsModule } from '@angular/forms';
import { NgModule, Component, ElementRef,  Injectable, Inject, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { Modal } from '../../../../common/components/modal/modal';
import { BaseDetailService } from './../../../../common/top-common/base-detail.service';
import { BaseDetailComponent } from "../../../../common/top-common/base-detail.component";
import { TemplateDetailOption } from './../../../../common/components/templates/template-detail';
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { Grid } from './../../../../common/components/grid/grid';
import { GridOption, GridPage, GridEditOption} from '../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { GridColumnDef } from '../../../../common/components/grid/grid-column';
import { DateUtil } from '../../../../common/services/utils/date-util';
// 自定义服务
import { StockPdykDetailService } from './stockpdyk-detail.service';
import { GridData } from '../../../../common/components/grid/grid-data-entity';
import { SuiResponse } from '../../../../common/services/https/sui-http-entity';
import { ok } from 'assert';

const SUCC = 0;
/**
 * 详情请求参数
 */
interface ReqParam {
    // -1:全部
    goodsid: number;
    sheetid: number;
    // -1-全部  1-有库存未盘点  2-无库存有盘点  3-只看盘盈  4-只看盘亏
    optype?: number;
}

/**
 * 盘点操作参数
 */
interface OperParam {
    sheetid: number;
    // 生成报告=3   确认盘点=1   终止盘点=4
    status: number;
}

@Component({
    templateUrl: './stockpdyk-detail.html',
    styleUrls: [ './stockpdyk.scss' ]
})

export class StockPdykDetailComponent extends  BaseDetailComponent implements OnInit, AfterViewInit {
    /** template-edit配置参数 */
    option: TemplateDetailOption = {};

    /** 额外工具栏 */
    extraBtns: ToolBarButton[];
    
    /** 工具栏数据 toolBarData */
    toolBarData: ToolBarButton[];
    tools: ToolBarButton[];
    
    /** 基本信息是否展开 */
    expanded: Boolean = true;

    // 请求参数
    reqParam: ReqParam;
    operParam: OperParam;
    // 路由参数
    routerParam: {sheetid: number, [propName: string]: any};
    
    // 选择查询的商品
    selectedGoods: Array<{goodsid: number, [propName: string]: any}>;
    // 要查看的商品
    viewedGoods: {goodsid: number, [propName: string]: any};
    // 基本信息
    headInfo: any;
    // 表格信息
    gridData: Array<{goodsid: number, [propName: string]: any}>;
    // 弹框信息
    goodsInfo: Array<{goodsid: number, [propName: string]: any}>;
    
    // 表格
    @ViewChild('grid') mygrid: Grid;

    /**
     * 弹窗
     */
    @ViewChild('stockPdGoodsInfoModal') stockPdGoodsInfoModal: Modal;
    
    
    // 列表配置参数
    gridOption: GridOption<any>;
    gridEditOption: GridEditOption;
    /** 表格列配置信息 */
    columnDefs: GridColumnDef[];

    // 静态数据
    pdTypeObj: object;
    statusObj: object;
    filters:  Array<any>;
    isChanged: boolean;
    inEdit: boolean;
    /**
     * 构造函数
     */
    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseDetailService: BaseDetailService,
        private stockPdykDetailService: StockPdykDetailService,
        private dateUtil: DateUtil
    ){
        super();
    }
    
    /**
     * 初始化
     */
    ngAfterViewInit(){
        this.initGridColumns();
        this.mygrid.reload(this.reqParam);
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     * 
     * 加载详情数据
     */
    loadPageInitData(): void {
        if (this.reqParam.sheetid == -1){
            this.baseService.modalService.modalToast('盘点单详情加载失败，请刷新重试！');
            return ;
        }
        super.requestConfigBeforePageInit([
            // this.stockPdykDetailService.getSheetDetail(this.reqParam),
            this.stockPdykDetailService.getSheetDetailHead(this.reqParam),
        ]).subscribe(results => {
            this.inEdit = false;
            let res1 = results[0];
            // let res2 = results[1];
            if (res1.retCode !== 0) {
                this.baseService.modalService.modalToast(res1.message);
                return;
            }
            /* if (res2.retCode !== 0) {
                this.baseService.modalService.modalToast(res2.message);
                return;
            } */
            // 初始化表格信息
/*             let items = res1.data.result;
            this.mygrid.setData(items); */
            // 2. 初始化头信息
            let head = res1.data.result;
            this.headInfo = res1.data.result || {};
            
            this.setHeadInfo();
            // 进入编辑状态
            if ( typeof this.tab.routerParam.entitys !== 'undefined' &&  typeof this.tab.routerParam.entitys[0].sheetid !== 'undefined'){
                this.doEdit();
            }
        }); 
    }
    
    /**
     * 设置头部部分信息
     */
    private setHeadInfo(){
        this.headInfo.pdtypeName = this.pdTypeObj[this.headInfo.pdtype];
        this.headInfo.statusName = this.statusObj[this.headInfo.status];
        this.headInfo.editdate = this.dateUtil.toStr(new Date(this.headInfo.editdate));
        // 设置按钮状态
        this.setToolsStatus();
        // 設置表格動態顯示以及按鈕顯示
        this.setColumnShowHide();
    }
    
    
    /**
     * 設置某一列顯示或隱藏
     */
    private setColumnShowHide(){
        let res = this.headInfo.status;
        if (res == 1){
            this.mygrid.showcolumn('pdykvalue');
        }else{
            this.mygrid.hidecolumn('pdykvalue');
        }
    }
    
    /**
     * 初始化
     */
    ngOnInit(){
        super.ngOnInit();
        this.initTools();

        this.pdTypeObj = this.stockPdykDetailService.getPdTypeObj();
        this.statusObj = this.stockPdykDetailService.getStatusObj();

        this.initGrid();

        this.initParam();
        this.initFilters();
        this.viewedGoods = {goodsid: -1};
        this.isChanged = false;
        this.inEdit = false;
    }

    /**
     * 初始化参数
     */
    private initParam(){
        this.operParam = {
            sheetid: -1,
            status: -1
        };
        this.reqParam = {
            goodsid: -1,
            sheetid: -1,
            optype: -1
        };
        this.getRouteParam();
    }
    
    
    /**
     * 获取传递过来的参数
     */
    private getRouteParam(): void {
        console.log('参数', this.tab.routerParam);
        let entitys = this.tab.routerParam.entitys;
        let entity = this.tab.routerParam.entity;
        
        this.routerParam = entity || entitys[0] || {sheetid: -1};

        // 设置查询参数
        this.reqParam = {
            goodsid: -1,
            sheetid:  this.routerParam.sheetid,
            optype: -1
        }; 
        
        this.loadPageInitData();
    }
    
    /**
     * 重新加载数据
     */
    private reloadData(){
        // 重置编辑监控
        this.isChanged = false;
        this.loadPageInitData();
        this.mygrid.load();
    }
    
    /**
     * 快速排序
     */
    private initFilters(){
        this.filters = [
            {label: "全部", value: -1, active: true},
            {label: "有库存未盘点", value: 1},
            {label: "无库存有盘点", value: 2},
            {label: "只看盘盈", value: 3},
            {label: "只看盘亏", value: 4}
            
        ];
    }


    /**
     * 初始化按钮栏
     */
    private initTools(){
        this.toolBarData = [{
            name: 'back',
            label: '返回',
            placeholder: '返回',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'A|B|M'
        },
        {
            name: 'save',
            label: '保存',
            placeholder: '保存',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'A|B|M'
        },
        {
            name: 'stop',
            label: '终止盘点',
            placeholder: '终止盘点',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'A|B|M'
        }];
        this.option = {
            tab: this.tab
        };
        
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, this.toolBarData);
    }

    /**
     * 设置按钮状态
     */
    private setToolsStatus(){
        let res =  this.headInfo.status;
        let state = res == 3;
        let extraBtns = {
            stop: res == 3 || res == 0,
            save: state
        };
        let toolBarStatus = {
            'back': true,
            'print': false,
            'list': false,
            'del': false,
            'reset': false,
            'add': false,
            'edit': state,
            'copy': false,
            'cancel': false,
            'preNext': false,
            'check': false,
            'editComplete': false
        };

        Object.assign(toolBarStatus, extraBtns);
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 表格数据插入前
     */
    private rowBeforeAdd = (row): boolean => {
        let rowToolState = {
            goodsDetail: true
        };
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列表
     */
    private initGrid() {

        let tools = [{
            name: "goodsDetail",
            label: "查看明细"
        }];

        this.gridOption = {
            selectionMode: 'none',
            isShowRowNo: true ,
            gridType: 'M',
            tools: tools,
            rowBeforeAdd: this.rowBeforeAdd,
            isEdit: true,
        };
        this.gridEditOption = {
            submitServerFields: ["goodsid", 'palletid', 'mygoodsid', 'goodsname', 'barcode', 'spec', 'uname', "stkqty",
                "pdqty", 'pdykqty', "pdykvalue"],
            duplicateRowFields: ["goodsid"],
            coverFields: ["pdqty",  "notes"],
            cumulateFields: ["pdqty"],
            promptTemplate: "商品[${row.goodsname}]已存在: ${row.pdqty+row.uname}"
        };
        this.gridOption.loadDataInterface = (param) => this.loadGridData(param);
        this.gridOption.rowBeforeAdd = this.rowBeforeAdd;
    }

    /**
     * 盘点数量验证
     */
    private getGridValidation(){
        return {
            pdqty: (cell, value) => {
                if (value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER ) {
                    return { results: false, message: `散数范围: ${Number.MIN_SAFE_INTEGER} 到 ${Number.MAX_SAFE_INTEGER} ` };
                }
                return true;
            },
        };
    }
    
    /**
     * 表格初始化
     */
    private initGridColumns() {
        let columnDefs = [
            { text: "货道号", datafield: "palletid", columntype: "Number", "width": '8%', editable: false, pinned: true },
            { text: "商品内码", datafield: "mygoodsid", width: '12%', "editable": false, pinned: true },
            { text: "商品名称", datafield: "goodsname", width: '12%', "editable": false, pinned: true },
            { text: "条码", datafield: "barcode", align: "string", "width": '12%', "editable": false},
            { text: "销售规格", datafield: "spec", width: '6%', "editable": false },
            { text: "包装单位", datafield: "uname", width: '6%', "editable": false },
            { text: "快照数量", datafield: "stkqty", columntype: "numberinput", "align": "right", "editable": false, "width": '10%' },
            { text: "盘点数量", datafield: "pdqty", columntype: "numberinput", "align": "right", "editable": false, "width": '10%' },
            { text: "盈亏数量", datafield: "pdykqty", columntype: "numberinput", "align": "right", "editable": false, "width": '10%' },
            { text: "盈亏金额(元)", datafield: "pdykvalue", columntype: "Number", "cellsformat": "c2", "align": "right", "editable": false, "width": '12%' },
            { text: "操作", datafield: "tools", columntype: "tools", "editable": false, "width": '8%' },
        ], 
        columnGroups = [];

        this.mygrid.setColumns(columnDefs, columnGroups, this.getGridValidation());
    }
    
    /**
     * 加载表格数据
     */
    private loadGridData(param: any){
        if ( !this.isChanged){
            return  this.stockPdykDetailService.getSheetDetail(param, this.reqParam);
        }else {
            this.baseService.modalService.modalConfirm('您有数据未提交，是否提交?', '保存确认', 'warning', '确认', '取消').subscribe( (data) => {
                if (data == "OK" ){
                    this.doSave();
                }else{
                    return  this.stockPdykDetailService.getSheetDetail(param, this.reqParam);
                }
            });
        }
    }
    
    
    /**
     * 显示基本信息
     */
    private showHead(event): void {
        this.expanded = !this.expanded;
    }
    
    /**
     * 返回列表
     */
    doBack(): void{
        this.goToPage(this.ATTR.L, {}, this.tab.moduleid);
    }
    
    /**
     * 过滤
     */
    private fastFilter(item, index, event){
        this.reqParam.optype = item.value;
        this.filters.forEach( (entity) => {
            entity.active = false;
        });
        item.active = true;
        this.mygrid.reload(this.reqParam);
    }
    

    /**
     * 商品选择
     */
    private selectGoods(event): void {
        this.selectedGoods = event;
        this.reqParam.goodsid = this.selectedGoods && this.selectedGoods[0] && this.selectedGoods[0]['goodsid'] || -1;
    }
    
    /**
     * 查询商品
     */
    private queryGoods(event){
        this.mygrid.reload(this.reqParam);
        this.focus();
    }
    
    /**
     * 查看商品明細
     */
    doGoodsDetail(param: any){
        console.log('查看商品明細', param);
        // 查看明细
        this.viewedGoods = param.entitys[0];
        this.viewedGoods.pdaddr = this.headInfo.pdaddr;
        this.openGoodsInfoModal(this.viewedGoods.goodsid);
    }
    
    /**
     * 打开录入明细
     */
    private openGoodsInfoModal(goodsid: number): void{
        
        let param = {
            goodsid: goodsid,
            sheetid: this.headInfo.sheetid
        };
        this.stockPdykDetailService.getGoodsInfo(param).subscribe( (data: SuiResponse<any>) => {
            if (data.retCode == SUCC){
                this.goodsInfo = data.data.result;
                this.stockPdGoodsInfoModal.open();
            }else{
                this.baseService.modalService.modalToast('查询录入数据失败，请重试！');
            }
        });
    }

    /**********************************************************************/
    /**
     * 自定义按钮
     */
    private onBtnClick(active: string){
        this.headInfo = this.headInfo || { status: 0};
        let status = this.headInfo.status;
        if (active == 'startpd' && status == 0){
            this.doStartpd();
        }else if (active == 'makeReport' && status == 0 ){
            this.doMakeReport();
        }else if (active == 'makesure'){
            if (status == 0 || status == 3){
                this.doMakesure();
            }
        }
    }
    
    /**
     * 盘点录入
     */
    doStartpd(): void{
        this.goToPage(this.ATTR.M, this.headInfo, this.tab.moduleid);
    }
    
    /**
     * 生成报告
     */
    doMakeReport(): void{
        let msg = '请确认您的盘点数据已全部录入！是否确认生成报告？';
        this.operateSheet(msg, 3);
    }
    
    /**
     * 确认盘点
     */
    doMakesure(): void{
        console.log('确认盘点', this.headInfo);
        let msg = '确认盘点将修改库存，请确认盘点盈亏是否已经核实！是否确认本次盘点结果？';
        this.operateSheet(msg, 1);
    }
    
    /**
     * 停止盘点
     */
    doStop(): void{
        console.log('停止盘点', this.headInfo);
        let msg = '盘点终止后将无法进行操作！您是否确认要终止本次盘点？';
        this.operateSheet(msg, 4);
    }

    /**
     * 操作盘点单
     */
    private operateSheet(msg: string, status: number): void{
        console.log('操作盘点单', this.headInfo);
        this.baseService.modalService.modalConfirm(msg, '盘点确认', 'warning', '确认', '取消').subscribe( (data) => {
            if (data == "OK"){
                // 确认盘点
                this.operParam.sheetid = this.headInfo.sheetid;
                this.operParam.status = status;
                this.stockPdykDetailService.doOperateSheet(this.operParam).subscribe( (res: SuiResponse<any>) => {
                    this.baseService.modalService.modalToast(res.message);
                    if (res.retCode == SUCC ){
                        // 刷新界面
                        this.loadPageInitData();
                    }
                });
            } else {
                // 取消确认盘点
            }
        });
        
    }


    /**
     * 关闭弹框
     */
    doClose(): void{
        this.stockPdGoodsInfoModal.close();
    }
    
    /**
     * 編輯
     */
    doEdit(){
        this.inEdit = true;
        this.headInfo.newEditdate = this.headInfo.editdate ||  this.dateUtil.toStr(new Date());
        this.mygrid.setcolumnproperty('pdqty', 'editable', true);
        this.focus();
        this.isChanged = true;
    }
    
    
    /**
     * 保存
     */
    doSave(){
        // TODO: 检查日期是否改变
        console.log('提交', this.headInfo);
        if (!this.isChanged){
            this.baseService.modalService.modalToast('您未修改数据!');
            return ;
        }
        this.baseService.modalService.modalConfirm('确认数据已经录入完成并提交数据？',
            '盘点录入', 'warning', '确认', '取消').subscribe( data => {
                if (data == "OK"){
                    // 确认盘点
                    this.commitData();
                } else {
                    // 取消确认盘点
                }
            });
    }

    /**
     * 提交数据
     */
    private commitData(){
        let param = {
            stockid: this.headInfo.stockid,
            sheetid: this.headInfo.sheetid,
            editdate: this.headInfo.newEditdate || this.headInfo.editdate,
            items: this.mygrid.selection.getAllRows()
        };
        this.stockPdykDetailService.doUpdate(param).subscribe( (data: SuiResponse<any>) => {
            console.log('提交数据', data);
            this.baseService.modalService.modalToast(data.message);
            if (data.retCode == SUCC){
                this.reloadData();
            }
        });
    }
    
}
