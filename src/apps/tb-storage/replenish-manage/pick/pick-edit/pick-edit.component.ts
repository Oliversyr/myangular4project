import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseListService } from '../../../../../common/top-common/base-list.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef, Injectable, Inject, NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input } from '@angular/core';
import { OnChanges, SimpleChanges, OnInit, DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseEditComponent } from "../../../../../common/top-common/base-edit.component";
import { TemplateEditOption } from '../../../../../common/components/templates/template-edit';
import { GridOption, GridPage, GridEditOption } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { PickEditService } from './pick-edit.service';
import { PickService } from './../pick.service';
import { GridSortOption } from './../../../../../common/components/grid/grid-sort';
import { StyleCompiler } from '@angular/compiler';
import { Observable } from 'rxjs/Observable';
import { Grid } from '../../../../../common/components/grid/grid';

/**
 * 单据参数
 */
interface PickInfo {
    sheetid: number;
    stockname: string;
    picktype: number;
    notes: string;
    status: number;
    sheetnum: number;
    shopnum: number;
    goodsnum: number;
    oknum: number;
    editor: string;
    editdate: string;
    checker: string;
    checkdate: string;
    stockid?: number;
}




/**
 * 商品出入库单编辑模块
 * @Created by: yangr 
 * @Created Date: 2017-12-06 11:33:27 
 * @Last Modified by: yangr
 * @Last Modified time: 2017-12-12 09:54:12
 */

@Component({
    templateUrl: './pick-edit.html',
    styleUrls: ['./pick-edit.scss']
})

export class PickEditComponent extends BaseEditComponent implements OnInit, AfterViewInit {
    /**
     * template-list配置参数
     */
    option: TemplateEditOption;
    /**
     * 列表配置参数
     */
    private gridOption: GridOption<any>;
    private gridEditOption: GridEditOption;
    private gridPage: GridPage;
    private gridGoodsData: Array<any>;

    delgridOption: GridOption<any>;
    gridDeliveryData: Array<any>;
    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];

    pickInfo: PickInfo;

    addGoods: any = {
        num: '',
        uname: "",
        stocknum: 0,
        price: '',
        notes: ''
    };

    myTabs: Array<any>;

    currentGrid: number = 1;

    /**
     * 机构自动补全选择框
     */

    @ViewChild('goodsSelect') goodsSelect;

    /**
     * 表格
     */
    @ViewChild('grid') mygrid: Grid;

    constructor(
        private rootElement: ElementRef,
        private baseService: BaseService,
        private baseListService: BaseListService,
        private myService: PickEditService,
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
        super.requestConfigBeforePageInit([this.pickService.getPickDetail(this.tab.routerParam.entity.sheetid)]).subscribe(data => {
            console.log('getStocktypeData==', data);
            this.pickInfo = data[0].data.result.head;
            this.gridGoodsData = data[0].data.result.goodsitems;
            this.mygrid.setData(this.gridGoodsData);
            if (this.pickInfo.picktype === 0) {
                this.mygrid.hidecolumn('custname');
            }
        });
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadPageInitData();
        this.initHeadParam();
        this.initGrid();
        this.initToolbar();

        this.option = {
            tab: this.tab
        }

        console.log(5555555555555, this.tab)
    }

    ngAfterViewInit() {
        //方式二: 放在ngAfterViewInit 初始化
        // this.initGridColumns();
    }   

    private initToolbar() {
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight);
        let toolBarStatus = { 'reset,print,del,add': false };
        this.baseService.setToolBarStates(this.tools, toolBarStatus);

    }

    /**
     * 初始化搜索参数
     */
    private initHeadParam() {
        this.pickInfo = {
            sheetid: 0,
            stockname: "",
            picktype: 0,
            notes: "",
            status: -1,
            sheetnum: 0,
            shopnum: 0,
            goodsnum: 0,
            oknum: 0,
            editor: "",
            editdate: "",
            checker: "",
            checkdate: ""
        }

    }

    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridOption = {
            gridType: "M",
            // isShowRowNo: true ,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight),
            isEdit: true,

            // primaryKeyFields:["stockid"]
            // toolsOrders: null ,
            // sorts: sorts,
            loadDataInterface: null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]

        };

        this.gridPage = {
            pageable: false
        }
        //方式一(推荐): ngOnInit 初始化时初始化列信息 ; 设置值给参数this.gridOption.columns
        this.initGridColumns();
        //方式二: 放在方法: ngAfterViewInit 初始化
    }

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            // purvalue: '<span>${rowdata.oiqty * rowdata.purvalue}</span>',
        };

        let columndef = [
            { "text": "店铺", "datafield": "custname", "align": "center", "width": 120, pinned: true, editable: false },
            { "text": "商品内码", "datafield": "mygoodsid", "align": "center", "width": 90, pinned: true, editable: false },
            { "text": "商品名称", "datafield": "goodsname", "align": "center", "minWidth": 200, pinned: true, editable: false },
            { "text": "条码", "datafield": "barcode", "align": "center", width: 100, editable: false },
            { "text": "汇总数量", "datafield": "qty", "align": "center", "width": 80, editable: false },
            { "text": "当前库存", "datafield": "accqty", "align": "center", "width": 90, editable: false },
            { "text": "拣货数量", "datafield": "pckqty", "align": "center", "width": 80, editable: true },
            { "text": "备注", "datafield": "notes", "align": "center", "width": 200, editable: true }
            // {"text":"操作", "datafield":"tools", "width": 200, columntype: 'tools', editable: false}
        ]

        //设置表格验证
        let getGridValidation = {
            pckqty: "required,number_8_2",
            notes: "len_0_16"
        }
        this.gridOption.columns = [columndef, [], columnTemplate, getGridValidation];
        // this.mygrid ==> undefined
        // 方式二: 放在ngAfterViewInit 执行
        // this.mygrid.setColumns(columndef, [], columnTemplate, getGridValidation);
    }

    /**
     * 保存
     */
    doSave(obj) {
        let param = {
            sheetid: this.pickInfo.sheetid,
            notes: this.pickInfo.notes,
            goodsitems: this.mygrid.selection.getAllRows(),
        }
        console.log(param)
        this.myService.updatePick(param).subscribe((res) => {
            this.baseService.modalService.modalToast(res.message);
            if (res.retCode === 0) {
                this.doBrowse({ sheetid: this.pickInfo.sheetid, status: this.pickInfo.status });
            }
        });
    }

}