import { SuiHttpService } from '../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef, Injectable, Inject, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
import { OnChanges, SimpleChanges, OnInit, DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../common/top-common/base-list.component";
import { TemplateListOption } from '../../../../common/components/templates/template-list';
import { StorehouseListService } from './storehouse-list.service';
import { StorehouseService } from './storehouse.service';
import { GridOption, GridPage } from '../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../common/directives/router/sui-router.sevice';
import { CUSTOM_MENUS } from '../../common/custom-menus';


import  GenerateData  from './generatedata';
import { SuiOrganComponent } from '../../../../common/business-components/base/organ/sui-organ.component';


/**
 * 搜索参数
 */
interface SearchParams {
    parentid: number;
    stockid: number;
    stocktype: number;
    status: number;
    coeid: number;
    manager: string;
}


/**
 * 仓库管理模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './storehouse-list.html',
    styleUrls: ['./storehouse-list.scss']
})

export class StorehouseComponent extends BaseListComponent implements OnInit, AfterViewInit {
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
    private gridOption: GridOption<any>;
    /**
     * 列表分页参数
     */
    private gridPage: GridPage;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];

    /**
     * 机构自动补全选择框
     */
    @ViewChild('organSelect') organSelect;
    @ViewChild('storehouseSelect') storehouseSelect;
    @ViewChild('shopSelect') shopSelect: SuiOrganComponent;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid;

    onStart(param) { };

    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseListService: BaseListService,
        private myService: StorehouseListService,
        private storehouseService: StorehouseService
    ) {
        super();


    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        super.requestConfigBeforePageInit([this.storehouseService.getStocktypeData()]).subscribe(data => {
            console.log('getStocktypeData==', data);
            this.stocktypeData = data[0].data.result;
            let all = {
                stocktypename: '全部',
                stocktype: -1
            }
            this.stocktypeData.unshift(all);
            this.searchParams.stocktype = 0;
            setTimeout(() => {
                this.searchParams.stocktype = -1;
            }, 100)
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.initSearchParam();
        this.initGrid();
        this.initToolbar();

        this.loadPageInitData();

        this.option = {
            isMoreSearch: true,
            tab: this.tab
        }

        console.log(">>>>>>>this.mRight", this.mRight)

    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
    }

    private initToolbar() {
        let extraBtns = [{
            name: 'forbidden',
            label: '禁用',
            placeholder: '批量禁用',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'L'
        }]

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);

        let toolBarStatus = { 'forbidden': true, 'print,copy,del,check,export,import,cancel': false };
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initSearchParam() {
        this.statusData = [
            { value: -1, label: '全部' },
            { value: 0, label: '禁用' },
            { value: 1, label: '正常' }
        ]


        this.searchParams = {
            parentid: -1,
            stockid: -1,
            stocktype: -1,
            coeid: -1,
            manager: '',
            status: -1
        }

    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        let extraBtns = [
            { name: "forbid", label: "禁用", placeholder: "禁用", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "restart", label: "启用", placeholder: "启用", state: true, useMode: "GRID_BAR", userPage: "A|M|B" },
            { name: "manageShop", label: "管理配送店铺", placeholder: "管理配送店铺", state: true, useMode: "GRID_BAR", userPage: "A|M|B" }
        ]

        this.gridOption = {
            selectionMode: "checkbox",
            isShowRowNo: true,
            rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight, extraBtns),
            primaryKeyFields: ["stockid", "status"]
            // toolsOrders: null ,
            // sorts: sorts,
            // loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => {
            this.mygrid.clearselection();
            return this.myService.getGridData(param, this.searchParams)
        };
    }

    private rowBeforeAdd = (row) => {
        let rowToolState: any = {};
        rowToolState.forbid = row.status == 1;
        rowToolState.restart = row.status == 0;
        rowToolState.browse = true;
        rowToolState.manageShop = true;
        this.mygrid.setRowToolState(row, rowToolState);
        return true;
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            shopnum: '<span>${value}家</span>',
            goodsnum: '<span>${value}种</span>',
            status: '<span>${value===0 ? "禁用" : "正常"}</span>',
        };

        let columndef = [
            { "text": "仓库编码", "datafield": "stockid", "align": "center", "width": 80, columntype: 'link|browse', pinned: true },
            { "text": "仓库名称", "datafield": "ename", "align": "center", "width": 200, pinned: true },
            { "text": "上级机构", "datafield": "parentfullname", "align": "center", "width": 200 },
            { "text": "仓库类型", "datafield": "stocktypename", "align": "center", width: 80 },
            { "text": "地址", "datafield": "address", "align": "center", minWidth: 200 },
            { "text": "仓管员", "datafield": "manager", "align": "center", "width": 90 },
            { "text": "配送店铺", "datafield": "shopnum", "align": "center", "width": 80, columntype: 'template' },
            { "text": "库存商品", "datafield": "goodsnum", "align": "center", "width": 80, columntype: 'template' },
            { "text": "状态", "datafield": "status", "align": "center", "width": 80, columntype: 'template' },
            { "text": "操作", "datafield": "tools", "width": 150, columntype: 'tools' }
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 上级机构选择
     */
    selectedOrgan(org) {
        this.searchParams.parentid = org.length !== 0 ? org[0].eid : -1;
    }

    /**
     * 仓库选择
     */
    selectedStorehouse(org) {
        this.searchParams.stockid = org.length !== 0 ? org[0].stockid : -1;
    }

    /**
     * 店铺选择
     */
    selectedShop(org) {
        this.searchParams.coeid = org.length !== 0 ? org[0].eid : -1;
    }

    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        this.mygrid.load();
    }

    doReset() {
        this.searchParams = {
            parentid: -1,
            stockid: -1,
            stocktype: -1,
            coeid: -1,
            manager: '',
            status: -1
        }

        this.organSelect.clearSelection();
        this.storehouseSelect.clearSelection();
        this.shopSelect.clearSelection();

        this.mygrid.load();
    }


    /**
     * 表格按钮点击
     */
    doForbid(obj) {
        let thisData = obj.entitys[0];
        this.storehouseService.doOperate(0, [thisData.stockid]).subscribe((res) => {
            if (res.retCode === 0) {
                this.baseService.modalService.modalToast(res.message);
                this.mygrid.load();
            }
        });
    }
    doRestart(obj) {
        let thisData = obj.entitys[0];
        this.storehouseService.doOperate(1, [thisData.stockid]).subscribe((res) => {
            if (res.retCode === 0) {
                this.baseService.modalService.modalToast(res.message);
                this.mygrid.load();
            }
        });
    }
    doManageShop(obj) {
        let thisData = obj.entitys[0];
        console.log(obj)
        super.goToPage(this.ATTR.L, { entity: thisData }, CUSTOM_MENUS.MANAGE_SHOP);
    }


    /**
     * 按钮栏按钮点击
     */
    doForbidden(obj) {
        console.log(obj)
        let selectedData = obj.entitys;
        let stockids;
        if (!selectedData || selectedData.length === 0) {
            this.baseService.modalService.modalToast('请选择仓库');
            return;
        } else {
            stockids = [];
            selectedData.forEach((item, i) => {
                // if (item.status === 1) {
                stockids.push(item.stockid);
                // }
            });
            // if (stockids.length === 0) {
            //     this.baseService.modalService.modalToast('请选择状态为【正常】的仓库');
            //     return;
            // }
        }

        this.storehouseService.doOperate(0, stockids).subscribe((res) => {
            if (res.retCode === 0) {
                this.baseService.modalService.modalToast(res.message);
                this.mygrid.load();
            }
        });
    }

/* 
    source: any =
        {
            localdata: GenerateData.generateData(250, false),
            datafields:
                [
                    { name: 'name', type: 'string' },
                    { name: 'productname', type: 'string' },
                    { name: 'available', type: 'bool' },
                    { name: 'date', type: 'date' },
                    { name: 'quantity', type: 'number' },
                    { name: 'price', type: 'number' }
                ],
            datatype: 'array'
        }

    dataAdapter: any = new jqx.dataAdapter(this.source);

    columns: any[] =
        [
            { text: 'Name', columntype: 'textbox', filtertype: 'textbox', datafield: 'name', width: 180 },
            { text: 'Produkt', filtertype: 'textbox', datafield: 'productname', width: 220 },
            { text: 'Datum', datafield: 'date', columntype: 'datetimeinput', filtertype: 'date', width: 210, cellsalign: 'right', cellsformat: 'd' },
            { text: 'Qt.', datafield: 'quantity', columntype: 'numberinput', filtertype: 'textbox', cellsalign: 'right', width: 60 },
            { text: 'Preis', datafield: 'price', columntype: 'numberinput', filtertype: 'textbox', cellsformat: 'c2', cellsalign: 'right' }
        ]; */

}