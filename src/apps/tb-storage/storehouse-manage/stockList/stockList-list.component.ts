
import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../common/top-common/base-list.component";
import { TemplateListOption } from '../../../../common/components/templates/template-list';
import { StockListService } from './stockList-list.service';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../common/directives/router/sui-router.sevice';
import { GridSortOption } from './../../../../common/components/grid/grid-sort';
import { CUSTOM_MENUS } from '../../common/custom-menus';

/**
 * 搜索参数
 */
interface SearchParams {
    keyvalue: string;
    stockid: number;
    optype: number;
}


/**
 * 库存清单
 * @Created by: yangr 
 * @Created Date: 2017-12-28 14:21:04 
 * @Last Modified by:   yangr 
 * @Last Modified time: 2017-12-28 14:21:04 
 */

@Component({
    templateUrl: './stockList-list.html',
    styleUrls: [ './stockList-list.scss' ]
})

export class StockListComponent extends BaseListComponent implements OnInit, AfterViewInit {
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 搜索参数
     */
    searchParams: SearchParams;
    /**
     * 仓库类型
     */
    stocktypeData: Array<object> = [];
    /**
     * 状态
     */
    statusData: Array<object>;
    /**
     * 列表配置参数
     */
    gridOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    gridPage: GridPage;
    /**
     * 列表排序参数
     */
    sorts: GridSortOption[];
    /**
     * 列表选中值
     */
    selectedGridData: any;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];
    /**
     * 快速筛选参数
     */
    private filters: Array<object>;
    /**
     * 默认选中仓库
     */
    defSelectItem: object;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid;
    /**
     * 仓库选择
     */
    @ViewChild('storehouseSelect') storehouseSelect;

    /**
     * 库存调整弹窗
     */
    @ViewChild('adjust') myadjust;
    /**
     * 库存流水弹窗
     */
    @ViewChild('booklist') mybooklist;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: StockListService,
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    // loadPageInitData() {
        // super.requestConfigBeforePageInit([this.myService.getStocktypeData()]).subscribe(data => {
            // console.log('getStocktypeData==',data);
            // this.stocktypeData = data[0].data.result;
            // let all = {
            //     stocktypename: '全部',
            //     stocktype: -1
            // }
            // this.stocktypeData.unshift(all);
            // this.searchParams.stocktype = 0;
            // setTimeout(() => {
            //     this.searchParams.stocktype = -1;
            // }, 100)
    //     });
    // }

    ngOnInit() {
        super.ngOnInit();
        this.initSearchParam();
        this.initGrid();
        this.initGridSort();
        this.initToolbar();

        this.option = {
            isMoreSearch: false,
            tab: this.tab
        }

        if(this.tab.routerParam) {
            this.defSelectItem = this.tab.routerParam;
            this.searchParams.stockid = this.tab.routerParam.stockid;
        }

        this.filters = [
            {label: "全部", value: -1, active: true},
            {label: "有库存商品", value: 1},
            {label: "有库存未经营商品", value: 2},
            {label: "无库存商品", value: 3}
        ]
    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    }



    private initToolbar() {
        let extraBtns = [{
            name: 'adjustStocks',
            label: '库存调整',
            placeholder: '库存调整',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'L'
        }]

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);

        let toolBarStatus = {'adjustStocks': true, 'add,print,copy,import,del,cancel,check': false};
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        this.searchParams = {
            keyvalue: '',
            stockid: -1,
            optype: -1
        }

    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        let extraBtns = [
            { name: "adjustStock", label: "库存调整", placeholder: "库存调整", state: true, useMode:"GRID_BAR", userPage: "L" },
            { name: "booklist", label: "库存流水", placeholder: "库存流水", state: true, useMode:"GRID_BAR", userPage: "A|B|M" },
        ]

        this.gridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true ,
            rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight, extraBtns),
            // primaryKeyFields:["coeid"],
            // toolsOrders: null ,
            // sorts: this.sorts,
            // loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => {
            this.mygrid.clearselection();
            return this.myService.getGridData(param, this.searchParams)
        };

       
    }

    private initGridSort() {
        //表格排序
        this.sorts = [
            { field: "stockNum", label: "库存数量" },
            { field: "saleNum", label: "日均销量" },
        ];
    }

    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.adjustStock = true;
        rowToolState.booklist = true;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            status: '<span>${value===0 ? "禁用" : "正常"}</span>',
        } ;

        let columndef = [
            {"text":"仓库", "datafield":"stockname","align":"center", "width": 200, pinned: true},
            {"text":"商品内码", "datafield":"mygoodsid","align":"center", "width": 100, pinned: true},
            {"text":"商品名称", "datafield":"goodsname","align":"left", minWidth: 200, pinned: true},
            {"text":"商品条码", "datafield":"barcode","align":"center", width: 120},
            {"text":"销售规格", "datafield":"spec","align":"center", "width": 100},
            {"text":"库存数量", "datafield":"qtystr","align":"center", "width": 90},
            {"text":"日均销量", "datafield":"dailysale","align":"center", "width": 80},
            {"text":"售价（元）", "datafield":"price","align":"right", "width": 80},
            {"text":"商品状态", "datafield":"status","align":"center", "width": 80, pinned: true, columntype: "template"},
            {"text":"操作", "datafield":"tools", "width": 150, columntype: 'tools'}
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 仓库选择
     */
    selectedStorehouse(org) {
        console.log(org)
        this.searchParams.stockid = org.length !== 0 ? org[0].stockid : -1;
    }

    /**
     * 快速筛选
     */
    private fastFilter(obj, event) {
        for (let i = 0; i < this.filters.length; i++) {
            if(this.filters[i]['active']) {
                this.filters[i]['active'] = false;
                break;
            }
        }

        obj.active = true;

        this.searchParams.optype = obj.value;
        this.mygrid.load();
    }

    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        this.mygrid.load();
    }
    doReset() {
        this.searchParams = {
            keyvalue: '',
            stockid: -1,
            optype: -1
        }

        this.storehouseSelect.clearSelection();
        this.mygrid.load();
    }

    /**
     * 表格按钮点击
     */
    doAdjustStock(obj) {
        console.log(obj)
        this.selectedGridData = obj.entitys;
        this.myadjust.doAdjust();
    }
    doBooklist(obj) {
        let thisData = obj.entitys[0];
        super.goToPage(this.ATTR.L, {entity: thisData}, CUSTOM_MENUS.BOOK_LIST);
    }

    /**
     * 按钮栏按钮点击
     */
    doAdjustStocks(obj) {
        console.log(obj)
        if(obj.entitys.length === 0) {
            this.baseService.modalService.modalToast("请选择商品！");
            return ;
        }
        this.selectedGridData = obj.entitys;
        this.myadjust.doAdjust();
    }
}