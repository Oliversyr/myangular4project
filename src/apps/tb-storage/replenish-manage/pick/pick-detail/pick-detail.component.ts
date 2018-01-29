import { SuiHttpService } from '../../../../../common/services/https/sui-http.service';
import { BaseDetailService } from '../../../../../common/top-common/base-detail.service';
import { BaseService } from '../../../../../common/top-common/base.service';
import { FormsModule } from '@angular/forms';
import { SuiHttpModule } from '../../../../../common/services/https/sui-http.module';
import { NgModule, Component, ElementRef,  Injectable, Inject,NO_ERRORS_SCHEMA, ViewChild, TemplateRef, Input} from '@angular/core';
import { OnChanges, SimpleChanges, OnInit,  DoCheck, AfterContentChecked, AfterContentInit, AfterViewInit,  AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router';
import { BaseDetailComponent } from "../../../../../common/top-common/base-detail.component";
import { TemplateDetailOption } from '../../../../../common/components/templates/template-detail';
import { GridOption, GridPage, GridEditOption } from '../../../../../common/components/grid/grid-option';
import { ToolBarButton } from '../../../../../common/components/toolbar/toolbar';
import { SuiRouterService } from './../../../../../common/directives/router/sui-router.sevice';
import { PickDetailService } from './pick-detail.service';
import { PickService } from './../pick.service';
import { GridSortOption } from './../../../../../common/components/grid/grid-sort';
import { Observable } from 'rxjs/Observable';
import { CUSTOM_MENUS } from '../../../common/custom-menus';

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
    templateUrl: './pick-detail.html',
    styleUrls: [ './pick-detail.scss' ]
})

export class PickDetailComponent extends BaseDetailComponent implements OnInit, AfterViewInit {
    /**
     * template-list配置参数
     */
    option: TemplateDetailOption;
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
        price: '',
        notes: ''
    };

    myTabs: Array<any>;

    currentGrid: number = 1;

    /**
     * 列表排序参数
     */
    // private sorts: GridSortOption[];

    /**
     * 表格
     */
    @ViewChild('addDel') addDel;
    @ViewChild('grid') mygrid;
    @ViewChild('deliveryGrid') delgrid;

    onStart(param) {};

    constructor(
        private rootElement : ElementRef, 
        private baseService: BaseService, 
        private baseDetailService: BaseDetailService,
        private myService: PickDetailService,
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
            console.log('getStocktypeData==',data);
            this.pickInfo = data[0].data.result.head;
            this.gridGoodsData = data[0].data.result.goodsitems;
            this.gridDeliveryData = data[0].data.result.sheetitems;

            this.initToolbar();
      });
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadPageInitData();
        this.initHeadParam();
        this.initGrid();

        this.option = {
            tab: this.tab
        }

        console.log("this.tab》》》》》》", this.tab)
    }

    ngAfterViewInit() {
        this.initGridColumns();
        this.mygrid.load();
        this.delgrid.load();

        if(this.pickInfo.picktype === 0) {
            this.mygrid.hidecolumn('custname');
        }
    }

    private initToolbar() {
        let extraBtns = [{
            name: 'editFinish',
            label: '拣货完成',
            placeholder: '拣货完成',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'B'
        }, {
            name: 'addDelivery',
            label: '添加配送单',
            placeholder: '添加配送单',
            state: true,
            selectRecordMode: '',
            useMode: 'TOP_BAR',
            userPage: 'B'
        }]
        this.tools = this.baseService.getTopToolBar(this.tab.attr, this.mRight, extraBtns);
        let toolBarStatus = {'editFinish,addDelivery': this.pickInfo.status === 0, "edit": this.pickInfo.status === 0, 'add,copy,check,preNext,cancel': false};
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
            checkdate: "",
            stockid: -1
        }

        this.myTabs = [
            {label: '拣货商品', active: true, value: 1},
            {label: '配送单', active: false, value: 2}
        ]

    }



    /**
     * 初始化表格插件
     */
    private initGrid() {
        this.gridPage = {
            pageable: true,
            isServerPage: false
        };

        let extraBtns = [{
            name: 'split',
            label: '分货',
            placeholder: '分货',
            state: true,
            selectRecordMode: '',
            useMode: 'GRID_BAR',
            userPage: 'B'
        }, {
            name: 'delete',
            label: '移除',
            placeholder: '移除',
            state: true,
            selectRecordMode: '',
            useMode: 'GRID_BAR',
            userPage: 'B'
        }]

        this.gridOption = {
            gridType: 'M',
            selectionMode: "singlerow",
            isShowRowNo: true ,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight, extraBtns),
            isEdit: false,
            primaryKeyFields:["sheetid", "goodsid"],
            // toolsOrders: null ,
            // sorts: sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]

        };

        this.gridOption.loadDataInterface = (param) => {
            return new Observable<any>((observable) => {
                this.pickService.getPickDetail(this.tab.routerParam.entity.sheetid).subscribe((res) => {
                    if(res.retCode === 0) {
                        let data = {
                            rows: res.data.result.goodsitems || [],
                            footer: {
                                totalCount: res.data.result.goodsitems ? res.data.result.goodsitems.length : 0
                            }
                        }
                        observable.next(data);
                    }
                    observable.complete();
                })
            })
        } 

        this.gridOption.rowBeforeAdd = (row) => {
            let rowToolState: any = {};
            rowToolState.split = true;
            this.mygrid.setRowToolState(row, rowToolState);
            return true;
        }

        this.delgridOption = {
            selectionMode: "singlerow",
            gridType: 'M',
            isShowRowNo: true ,
            // rowBeforeAdd: this.rowBeforeAdd,
            tools: this.baseService.getGridToolBar(this.mRight, extraBtns),
            isEdit: false,
            primaryKeyFields:["sheetid", "status"],
            // toolsOrders: null ,
            // sorts: sorts,
            loadDataInterface:null,
            // columngroups: [{"text":"商品信息","name":"goodsInfo","align":"center"}]

        };

        this.delgridOption.loadDataInterface = (param) => {
            return new Observable<any>((observable) => {
                this.pickService.getPickDetail(this.tab.routerParam.entity.sheetid).subscribe((res) => {
                    if(res.retCode === 0) {
                        let data = {
                            rows: res.data.result.sheetitems,
                            footer: {
                                totalCount: res.data.result.sheetitems.length
                            }
                        }
                        observable.next(data);
                    }
                    observable.complete();
                })
            })
        } 

        this.delgridOption.rowBeforeAdd = (row) => {
            let rowToolState: any = {};
            rowToolState.delete = true;
            this.delgrid.setRowToolState(row, rowToolState);
            return true;
        }

        
    }

    

    /**
     * 初始化表格列表
     */
    private initGridColumns() {

        let columnTemplate = {
            // qty: '<span>${value}${rowdata.uname}</span>',
        } ;

        let columndef = [
            {"text":"店铺", "datafield":"custname","align":"center", "width": 200, pinned: true,
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">小计</span>'
                    return renderstring;
                }
            },
            {"text":"商品内码", "datafield":"mygoodsid","align":"center", "width": 80, pinned: true},
            {"text":"商品名称", "datafield":"goodsname","align":"center", "minWidth": 150, pinned: true},
            {"text":"条码", "datafield":"barcode","align":"center", width: 90},
            {"text":"汇总数量", "datafield":"qty","align":"center", "width": 90, aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"当前库存", "datafield":"accqty","align":"center", "width": 90, aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"拣货数量", "datafield":"pckqty","align":"center", "width": 90, aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"备注", "datafield":"notes","align":"center", "width": 150},
            {"text":"操作", "datafield":"tools", "width": 80, columntype: 'tools'}
        ]

        this.mygrid.setColumns(columndef, [], columnTemplate);

        let delcolumndef = [
            {"text":"配送单号", "datafield":"sheetid","align":"center", "width": 90, pinned: true,
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">小计</span>'
                    return renderstring;
                }
            },
            {"text":"目的店铺", "datafield":"fullname","align":"center", "minWidth": 200, pinned: true},
            {"text":"配送仓库", "datafield":"stockname","align":"center", "width": 200, pinned: true},
            {"text":"配送商品", "datafield":"goodsnum","align":"center", width: 80, aggregates: ['sum'],
                aggregatesrenderer: (aggregates: any, column: any, element: any, summaryData: any): string => {
                    let renderstring = '<span style="line-height: 27px;">' + (aggregates.sum || 0) + '</span>'
                    return renderstring;
                }
            },
            {"text":"制单人", "datafield":"editor","align":"center", "width": 80},
            {"text":"制单时间", "datafield":"editdate","align":"center", "width": 200},
            {"text":"审核人", "datafield":"checker","align":"center", "width": 80},
            {"text":"审核时间", "datafield":"checkdate","align":"center", "width": 200},
            {"text":"操作", "datafield":"tools", "width": 80, columntype: 'tools'}
        ]

        this.delgrid.setColumns(delcolumndef, []);
    }

    /**
     * 拣货完成
     * 
     */
    doEditFinish() {
        this.baseService.modalService.modalConfirm('您是否已经完成拣货，商品已配送出库？').subscribe((res) => {
            if(res === "OK") { 
                this.pickService.doOperate(this.pickInfo.sheetid, 1).subscribe((res) => {
                    this.baseService.modalService.modalToast(res.message);
                    if(res.retCode === 0) {
                        this.pickInfo.status = 1;
                        this.initToolbar();
                    }
                })
            }
        })
        
    }

    /**
     * 编辑
     */
    doEdit(obj) {
        console.log(obj)
        super.doEdit({sheetid: this.pickInfo.sheetid, status: this.pickInfo.status});
    }

    /**
     * 分货
     */
    doSplit(obj) {
        console.log('doSplit===',obj)
        let param = obj.entitys[0];
        param.sheetid = this.pickInfo.sheetid;
        this.goToPage(this.ATTR.L, {entity: param}, CUSTOM_MENUS.SPLIT);
    }

    /**
     * 删除
     */
    doDel() {
        this.baseService.modalService.modalConfirm('您是否要删除本汇总拣货单？').subscribe((res) => {
            if(res === "OK") { 
                this.pickService.doOperate(this.pickInfo.sheetid, 4).subscribe((res) => {
                    this.baseService.modalService.modalToast(res.message);
                    if(res.retCode === 0) {
                        super.closePage();
                        super.doList(null);
                    }
                })
            }
        })
    }

    /**
     * 页签切换
     */
    tabClick(obj) {
        this.myTabs.forEach((item) => {
            item.active = false;
        });
        obj.active = true;
        this.currentGrid = obj.value;
    }

    /**
     * 添加配送单
     */
    doAddDelivery() {
        this.addDel.doAddDel();
    }

    /**
     * 添加配送单确定
     */
    addDelRefresh(obj) {
        this.pickInfo = obj.head;
        this.gridGoodsData = obj.goodsitems;
        this.gridDeliveryData = obj.sheetitems;
        this.mygrid.setData(this.gridGoodsData);
        this.delgrid.setData(this.gridDeliveryData);
    }

    /**
     * 删除配送单
     * @param obj 
     */
    doDelete(obj) {
        this.baseService.modalService.modalConfirm("移除配送单后将重新汇总拣货商品，并清空录入的拣货数量，是否确认？").subscribe((data) => {
            if(data === "OK") {
                let param = {
                    sheetid: this.pickInfo.sheetid,
                    refsheetids: [obj.entitys[0].sheetid]
                }

                this.myService.doOprDelivery(param, 2).subscribe((res) => {
                    console.log('res.retCode === ', res.retCode)
                    this.baseService.modalService.modalToast(res.message);
                    if(res.retCode === 0) {
                        let obj = res.data.result;
                        this.pickInfo = obj.head;
                        this.gridGoodsData = obj.goodsitems;
                        this.gridDeliveryData = obj.sheetitems;
                        this.mygrid.setData(this.gridGoodsData);
                        this.delgrid.setData(this.gridDeliveryData);
                    }
                })
            }
        })
    }

}