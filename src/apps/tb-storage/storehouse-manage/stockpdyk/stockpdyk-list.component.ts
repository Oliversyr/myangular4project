/*
@Description:库存盘点模块
 * @Author: cheng
 * @Date: 2017-12-26 19:39:26
 * @Last Modified by: cheng
 * @Last Modified time: 2018-01-22 19:43:14
 */
import { FormsModule } from '@angular/forms';
import { NgModule, Component, ElementRef, Injectable, Inject, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
import { OnChanges, SimpleChanges, OnInit, DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';

import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { BaseListComponent } from '../../../../common/top-common/base-list.component';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { DateUtil } from '../../../../common/services/utils/date-util';

// 自定义服务
import { StockPdykListService } from './stockpdyk-list.service';
import { isNumber } from 'util';
import { DateRangeModel } from '../../../../common/components/input/sui-date';
import { GridSortOption } from '../../../../common/components/grid/grid-sort';
import { TemplateDetailOption } from '../../../../common/components/templates/template-detail';
import { TemplateListOption } from '../../../../common/components/templates/template-list';
import { Grid } from '../../../../common/components/grid/grid';
import { Modal } from '../../../../common/components/modal/modal';
import { SuiOrganComponent } from '../../../../common/business-components/base/organ/sui-organ.component';
import { SuiGoodsComponent } from '../../../../common/business-components/base/goods/sui-goods.component';


/**
 * 搜索参数
 */
interface SearchParams {
    goodsid: number;
    stockid: number;
    status: number;
    bdate: string | Date;
    edate: string  | Date;
    orderby: number;
    basc: number;
}

@Component({
    templateUrl: './stockpdyk-list.html',
    styleUrls: ['./stockpdyk.scss']
})

export class StockPdykListComponent extends BaseListComponent implements OnInit, AfterViewInit {
    option: TemplateListOption = {};

    tools: ToolBarButton[];
    toolBarData: ToolBarButton[];
    // 搜索参数
    searchParams: SearchParams;
    // 日期
    dateValue: DateRangeModel;
    dateLabel: Array<any>;

    selectedStock: Array<any>;
    selectedGoods: Array<any>;

    // 店铺状态
    stateData: Array<any>;

    // 列表配置参数
    gridOption: GridOption<any>;
    /** 表格的表头自定义排序配置信息 */
    sorts: GridSortOption[] = [];
    // 今日
    toDateStr: string;
    // 盘点类型
    pdTypeObj: any;
    // 盘点状态
    statusObj: any;
    //
    /**
     * 表格
     */
    @ViewChild('grid') mygrid: Grid;
    // 新增弹出框
    @ViewChild('suiStockpdykAdd') suiStockpdykAdd: Modal;

    /**
     * 机构自动补全选择框
     */
    @ViewChild('OrganSelect') organSelect: SuiOrganComponent;
    @ViewChild('GoodsSelect') goodsSelect: SuiGoodsComponent;

    onStart(param) {}


    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseListService: BaseListService,
        private stockPdykListService: StockPdykListService,
        private dateUtil: DateUtil
    ) {
        super();
        this.toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadPageInitData();
        this.initLocalParam();
        this.initSearchParam();
        this.initGrid();
    }
    
    ngAfterViewInit(){
        this.initGridColumns();
        this.doSearch();
    }

    /**
     * 初始化本地数据
     */
    private initLocalParam() {
        this.dateLabel = [
            { value: 'editDate', label: '制单日期' }
        ];

        // -1:全部 0:盘点中 3:待确认 1:已确认 4:已取消
        this.stateData = [
            { value: -1, label: '全部' },
            { value: 0, label: '盘点中' },
            { value: 3, label: '待确认' },
            { value: 1, label: '已确认' },
            { value: 4, label: '已取消' },
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

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, this.toolBarData);
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
        
        // 隐藏更多
        this.option = {
            isMoreSearch: false,
            tab: this.tab
        };

        this.pdTypeObj = this.stockPdykListService.getPdTypeObj();
        this.statusObj = this.stockPdykListService.getStatusObj();
    }

    /**
     * 初始化搜索数据
     */
    private initSearchParam() {

        this.dateValue = {
            leftValue: 'editDate',
            beginDate: this.toDateStr,
            endDate: this.toDateStr
        };

        this.selectedStock = [];
        this.selectedGoods = [];

        this.searchParams = {
            goodsid: -1,
            stockid: -1,
            status: -1,
            bdate:  this.dateValue.beginDate,
            edate: this.dateValue.endDate,
            orderby: 0,
            basc: 0
        };

        let res = this.organSelect && this.organSelect.clearSelection();
        res = this.goodsSelect && this.goodsSelect.clearSelection();

    }

    /**
     * 行插入表格前执行函数
     */
    private rowBeforeAdd = (row) => {
        
        row.pdtypeName = this.pdTypeObj[row.pdtype];
        row.statusName = this.statusObj[row.status];
        
        row.editdate = this.dateUtil.toStr(new Date(row.editdate));
        if (row.checkdate){
            row.checkdate = this.dateUtil.toStr(new Date(row.checkdate));
        }else{
            row.checkdate = ''; 
        }
        
        row.pdykvalue = row.pdykvalue == 'null' ? 0 : row.pdykvalue;
        row.checker = (row.checker || '')  + '   ' + row.checkdate;
        let rowToolState: any = {};
        rowToolState.browse = true;
        rowToolState.edit =  (row.status == 0 || row.status == 3);
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.sorts = [
            { field: "1", label: "盈亏金额" }
        ];
        let extraBtns = [
            { name: "browse", label: "详情", placeholder: "详情", state: true, useMode: 'GRID_BAR', userPage: "A|M|B" },
            { name: "edit", label: "编辑", placeholder: "编辑", state: true, useMode: 'GRID_BAR', userPage: "A|M|B" }
        ];

        this.gridOption = {
            selectionMode: 'none',
            isShowRowNo: true,
            tools: this.baseService.getGridToolBar(this.mRight),
            primaryKeyFields: ["sheetid", 'pdaddr', 'pdtypeName', 'editdate', 'pdgoodsnum', ]
            // toolsOrders: null ,
            // loadDataInterface:null,
            // columngroups: [{'text':'商品信息','name':'goodsInfo','align':'center'}]
        };

        this.gridOption.loadDataInterface = (param) => this.stockPdykListService.getSheet(param, this.searchParams);
        this.gridOption.rowBeforeAdd = this.rowBeforeAdd;
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        const columnDefs = [

            {'text': '盘点单号', 'datafield': 'sheetid', 'align': 'center', 'width': 200, columntype: 'template', pinned: true},
            {'text': '盘点地点', 'datafield': 'pdaddr', 'align': 'center', 'width': '10%', pinned: true},
            {'text': '盘点类型', 'datafield': 'pdtypeName', 'align': 'center', 'width': '10%'},
            {'text': '盘点日期', 'datafield': 'editdate', 'align': 'center', cellsformat: "HH:mm:ss", width: '12%'},
            {'text': '盘点商品', 'datafield': 'pdgoodsnum', 'align': 'center', 'width': '8%', columntype: 'template', aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + ( aggregates.sum || 0) + '</span>';
                    return renderstring;
                }
            },
            {
                'text': '盘盈商品', 'datafield': 'pdygoodsnum', 'align': 'center', 'width': '8%', aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + ( aggregates.sum || 0) + '</span>';
                    return renderstring;
                }
            },
            {
                'text': '盘亏商品', 'datafield': 'pdkgoodsnum', 'align': 'center', 'width': '8%', columntype: 'template', 
                aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + ( aggregates.sum || 0) + '</span>';
                    return renderstring;
                }
            },
            {
                'text': '盈亏金额', 'datafield': 'pdykvalue', 'align': 'center', 'width': '10%', columntype: "Number", "cellsformat": "c2",
                aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + ( aggregates.sum || 0) + '</span>';
                    return renderstring;
                }
            },
            {
                'text': '确认人', 'datafield': 'checker', 'align': 'center', 'width': '18%',
/*                 cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties, rowdata) {
                    return `<div>${rowdata.checker}&nbsp;${rowdata.checkdate}</div>`;
                } */
            },
            { 'text': '盘点状态', 'datafield': 'statusName', 'align': 'center', 'width': '8%' },
            { 'text': '操作', 'datafield': 'tools', 'align': 'center', 'width': 100, columntype: 'tools' }
        ];

        this.mygrid.setColumns(columnDefs, []);
    }


    /**
     * 新增
     */
    protected doAdd(){
        this.suiStockpdykAdd.open();
    }

    /**
     * 查询
     */
    protected doSearch(){
        if (this.dateValue.beginDate){
            this.searchParams.bdate = this.dateValue.beginDate;
        }
        if (this.dateValue.endDate){
            this.searchParams.edate = this.dateValue.endDate;
        }
        this.mygrid.load();
    }

    /**
     * 重置
     */
    protected doReset(){
        this.initSearchParam();
        this.doSearch();
    }   
    
    protected doEdit(param, originalEvent) {
        super.goToPage(this.ATTR.B, param, this.tab.moduleid);
        // super.doBrowse(param, originalEvent);
    }
    
    /**
     * 商品选择
     */
    private selectGoods(data: Array<{goodsid: number}>): void {
        console.log('商品选择', data);
        this.selectedGoods = data;
        this.searchParams.goodsid = data[0] && data[0].goodsid;
    }

    /**
     * 仓库选择
     */
    private selectStock(data: Array<{stockid: number}> = [{stockid: -1}]): void {
        console.log('仓库选择', data);
        this.selectedStock = data;
        this.searchParams.stockid = data[0] && data[0].stockid;
    }

    /**
     * 弹出框回调
     */
    modalCallBack(event: any){
        console.log("回调", event);
        let sheetid = event.sheetid;
        if (sheetid > 0){
            this.goToPage(this.ATTR.B, {entity: {sheetid: sheetid}}, this.tab.moduleid);
        }
        this.suiStockpdykAdd.close();
    }

}
