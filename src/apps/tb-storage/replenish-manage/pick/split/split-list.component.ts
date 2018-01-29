import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseListComponent } from "../../../../../common/top-common/base-list.component";
import { TemplateListOption } from '../../../../../common/components/templates/template-list';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { SplitListService } from './split-list.service';
import { PickService } from './../pick.service';
import { GridSortOption } from './../../../../../common/components/grid/grid-sort';
import { HOTKEYS } from './../../../../../common/directives/keyboard/hotkeys';
import { SelectItem } from './../../../../../common/components/entitys/selectitem';

/**
 * 搜索参数
 */
interface SearchParams {
    shopeid?: number;
    editor: string;
    dateValue: any;
}


/**
 * 汇总拣货模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './split-list.html',
    styleUrls: [ './split-list.scss' ]
})

export class SplitListComponent extends BaseListComponent implements OnInit, AfterViewInit {
    hotkeys: any = HOTKEYS;
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 搜索参数
     */
    searchParams: SearchParams;
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

    goodsInfo: any;

    allData: Array<any>;

    /**
     * 机构自动补全选择框
     */
    @ViewChild('shopSelect') shopSelect;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: SplitListService,
        private pickService: PickService
    ) {
        super();
    }

    /**
     * 加载页面初始化数据
     * 支持多个请求;
     * 只要有一个请求失败,就要全部重新请求
     */
    loadPageInitData() {
        let params = {
            sheetid: this.tab.routerParam.entity.sheetid,
            goodsid: this.tab.routerParam.entity.goodsid
        }
        super.requestConfigBeforePageInit([this.myService.getGridData(params)]).subscribe(data => {
            console.log('getStocktypeData==',data);
            this.allData = data[0].data.result;
            this.mygrid.setData(this.allData);
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.initParam();
        this.initGrid();
        this.initToolbar();
        // this.tab.routerParam;

        this.loadPageInitData();

        this.option = {
            isMoreSearch: false,
            tab: this.tab
        }
    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.setData(this.allData);
    }

    private initToolbar() {
        let extraBtns = [{
            name: 'save',
            label: '保存',
            placeholder: '保存',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'L'
        }]

        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);

        let toolBarStatus = {'add,del,check,print,export,import,copy,cancel': false};
        this.baseService.setToolBarStates(this.tools, toolBarStatus);
    }

    /**
     * 初始化搜索参数
     */
    private initParam() {
        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());

        this.searchParams = {
            shopeid: -1,
            editor: "",
            dateValue: {
                beginDate: "",
                endDate: ""
            }
        }

        this.goodsInfo = this.tab.routerParam.entity;

    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        // let extraBtns = [
        //     { name: "pick", label: "拣货", placeholder: "拣货", state: true, useMode:"GRID_BAR", userPage: "L" },
        // ]

        this.gridOption = {
            selectionMode: "singlerow",
            isShowRowNo: true ,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight),
            // primaryKeyFields:["sheetid", "status", "oitypevalue"],
            isEdit: true,
            // toolsOrders: null ,
            // sorts: sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridPage = {
            pageable: true,
            isServerPage: false
        }

        
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            sheetnum: '<span>${value}张</span>',
            shopnum: '<span>${value}家</span>',
            status: '<span>${value===0 ? "拣货中" : "拣货完成"}</span>',
            picktype: '<span>${value===0 ? "按商品" : "按店铺商品"}</span>',
            goodsnum: '<span>${value}种</span>'
        } ;

        let columndef = [
            {"text":"配送单号", "datafield":"sheetid","align":"center", "width": 80, pinned: true, editable: false,
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">小计</span>'
                    return renderstring;
                }
            },
            {"text":"目的店铺", "datafield":"ename","align":"center", "minWidth": 200, pinned: true, editable: false},
            {"text":"制单人", "datafield":"editor","align":"center", "width": 80, editable: false},
            {"text":"制单时间", "datafield":"editdate","align":"center", width: 200, editable: false},
            {"text":"配送数量", "datafield":"qty","align":"center", "width": 90, editable: false, aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"配送出库数量", "datafield":"outqty","align":"center", "width": 110, editable: true},
        ]

        //设置表格验证
        let getGridValidation = {
            outqty: "required,number_8_0",
        }

        this.mygrid.setColumns(columndef, [], columnTemplate, getGridValidation);
    }

    /**
     * 店铺选择
     */
    selectedShop(org) {
        console.log(org);
        this.searchParams.shopeid = org.length !== 0 ? org[0].eid : -1;
    }

    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        let theData = this.allData;
        if(theData.length > 0) {
            let realData = [];
            for(let i = 0; i < theData.length; i++) {
                let item = theData[i];
                if(this.searchParams.shopeid && item.shopeid !== this.searchParams.shopeid) {
                    continue;
                }
                if(this.searchParams.editor && item.editor !== this.searchParams.editor) {
                    continue;
                }
                if(this.searchParams.dateValue.beginDate && item.editdate < this.searchParams.dateValue.beginDate) {
                    continue;
                }
                if(this.searchParams.dateValue.endDate && item.editdate > this.searchParams.dateValue.endDate) {
                    continue;
                }
                realData.push(item);
            }
            this.mygrid.setData(realData);
        }
    }
    doReset() {
        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.searchParams = {
            editor: "",
            dateValue: {
                beginDate: "",
                endDate: ""
            }
        }
        this.shopSelect.clearSelection();

        this.mygrid.setData(this.allData);
        
    }

    /**
     * 保存
     */
    doSave() {
        let allData = this.mygrid.selection.getAllRows();
        let param = [];
        allData.forEach((item, i) => {
            let data = {
                sheetid: item.sheetid,
                objectid: item.objectid,
                outqty: parseInt(item.outqty)
            }
            param.push(data);
        })

        console.log(allData, param)
        this.myService.saveSplit(param).subscribe((res) => {
            if(res.retCode === 0) {
                this.baseService.modalService.modalToast(res.message);
            }
        })
    }


}