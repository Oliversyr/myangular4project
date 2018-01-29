
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
import { BookListService } from './book-list.service';
import { GridOption, GridPage } from '../../../../../common/components/grid/grid-option';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { TemplateListOption } from '../../../../../common/components/templates/template-list';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { Observable } from 'rxjs/Observable';


/**
 * 搜索参数
 */
interface SearchParams {
    dateValue?: any;
    directflag: number;
    sheettype: number;
    sheetid: any;
}

/**
 * 库存流水
 * @Created by: yangr 
 * @Created Date: 2017-12-28 14:21:04 
 * @Last Modified by:   yangr 
 * @Last Modified time: 2017-12-28 14:21:04 
 */

@Component({
    templateUrl: './book-list.html',
    styleUrls: [ './book-list.scss' ]
})

export class BookListComponent extends BaseListComponent implements OnInit, AfterViewInit {
    /**
     * template-list配置参数
     */
    option: TemplateListOption;
    /**
     * 列表配置参数
     */
    gridOption: GridOption<any>;
    /**
     * 表格
     */
    @ViewChild('booklistgrid') mygrid;
    /**
     * 弹窗
     */
    @ViewChild('booklistModal') booklistModal;
    /**
     * 商品信息
     */
    @Input('goodsInfo') goodsInfo;

    /**
     * 工具栏按钮
     */
    private tools: ToolBarButton[];

    private searchParams: SearchParams;

    private directionData: Array<object>;

    private businessData: Array<object>;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseListService: BaseListService,
        private myService: BookListService,
    ) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.initMyGrid();
        this.initSearchParam();

        this.option = {
            isMoreSearch: false,
            tab: this.tab
        }

        console.log('this.tab==', this.tab)
        this.goodsInfo = this.tab.routerParam.entity;

    }

    ngAfterViewInit() {
        this.initMyGridColumns();
        this.mygrid.load();
    }

    private initSearchParam() {
        this.goodsInfo = {
            stockname: '',
            mygoodsid: '',
            goodsname: '',
            barcode: '',
            spec: ''
        }

        this.directionData = [
            {label: '全部', value: -1},
            {label: '出库', value: 1},
            {label: '入库', value: 2},
        ]

        this.businessData = this.myService.getBusinessData();

        this.searchParams = {
            directflag: -1,
            sheettype: -1,
            sheetid: ""
        }

        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.searchParams.dateValue = {
            beginDate: toDateStr,
            endDate: toDateStr
        }
    }

    /**
     * 初始化表格插件
     */
    private initMyGrid() {
        this.gridOption = {
            selectionMode: "singlerow",
            isShowRowNo: true ,
            isEdit: false,
            // showaggregates: true,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: null,

            // primaryKeyFields:["coeid"],
            // toolsOrders: null ,
            // sorts: this.sorts,
            // loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]
        };

        this.gridOption.loadDataInterface = (param) => {
            let searchParams = Object.assign({stockid: this.goodsInfo.stockid,goodsid: this.goodsInfo.goodsid}, this.searchParams)
            return this.myService.getGridData(param, searchParams);
        };

        
    }

    /**
     * 初始化表格列表
     */
    private initMyGridColumns() {
        let sheettypeObj = this.myService.getBusinessObj();

        let columnTemplate = {
            qtynum: '<span>${rowdata.adjustqty - rowdata.qty}${rowdata.uname}</span>',
            sheettype: (rowIndex: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any) =>{
                            console.log(sheettypeObj[value], value)
                            return sheettypeObj[value];
                        }
        } ;

        let columndef = [
            {"text":"发生时间", "datafield":"sdate","align":"center", "width": 150,
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">小计</span>'
                    return renderstring;
                }
            },
            {"text":"方向", "datafield":"directflag","align":"center", "width": 80},
            {"text":"业务", "datafield":"sheettype","align":"center", "width": 100, columntype: "template"},
            {"text":"单据编号", "datafield":"sheetid","align":"center", "width": 100},
            {"text":"发生数量", "datafield":"qty","align":"center", "width": 90},
            {"text":"成本价(元)", "datafield":"cost","align":"right", "width": 90, columntype: "template"},
            {"text":"发生金额(元)", "datafield":"costvalue","align":"right", "width": 90, cellsformat: 'c2', aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">￥' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"结存数量", "datafield":"closeqty","align":"center", width: 90, aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"结存金额(元)", "datafield":"closevalue","align":"right", width: 90,cellsformat: 'c2', aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">￥' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"摘要", "datafield":"notes","align":"center", minWidth: 200}
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);
    }

    /**
     * 搜索栏按钮点击
     */
    doSearch() {
        this.mygrid.load();
    }
    doReset() {
        this.searchParams = {
            directflag: -1,
            sheettype: -1,
            sheetid: ""
        }

        let toDateStr = this.baseService.commonServices.dateUtil.toStr(new Date());
        this.searchParams.dateValue = {
            beginDate: toDateStr,
            endDate: toDateStr
        }

        this.mygrid.load();
    }

    /**
     * 按钮栏按钮点击
     */
    // doBack() {
    //     this.doList(null);
    // }

    

}